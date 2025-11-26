package image

import (
	"context"
	"fmt"
	"mylife-monitor/pkg/entities"
	"mylife-tools/log"
	"strings"
	"time"

	"github.com/containers/image/v5/docker"
	"github.com/containers/image/v5/docker/reference"
)

var logger = log.CreateLogger("mylife:monitor:updates:docker:image")

type repository struct {
	Name     string                  // eg: mysql or plexinc/pms-docker or quay.io/oauth2-proxy/oauth2-proxy
	Versions map[string]*versionData // List of version
	Latest   string                  // Latest version tag
}

type versionData struct {
	Digest  string
	Created time.Time
}

func FetchImagesData(versions []*entities.UpdatesVersionValues) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*60)
	defer cancel()

	// Build repositories from image data
	// Note: we avoid to fetch multiple time same repository, we group all tags to fetch
	repos := make(map[string]*repository)

	for _, version := range versions {
		fullName := version.CurrentVersion
		split := strings.Split(fullName, ":")

		if len(split) < 2 {
			// no proper version
			continue
		}

		repoName := split[0]
		versionName := split[1]

		repo := repos[repoName]
		if repo == nil {
			repo = &repository{
				Name:     repoName,
				Versions: make(map[string]*versionData),
			}

			repos[repoName] = repo
		}

		repo.Versions[versionName] = &versionData{}
	}

	pool := MakeParallelTaskPool(ctx)

	// Repo dict itself does not move, no need for lock
	for _, repo := range repos {
		pool.Add(func(ctx context.Context) error {
			if err := fetchRepo(ctx, repo); err != nil {
				logger.WithError(err).WithField("repository", repo.Name).Error("Error getting repository data")
			}
			return nil
		})
	}

	if err := pool.Wait(); err != nil {
		return err
	}

	for _, version := range versions {
		fullName := version.CurrentVersion
		split := strings.Split(fullName, ":")

		if len(split) < 2 {
			// no proper version
			continue
		}

		repoName := split[0]
		versionName := split[1]

		repo := repos[repoName]

		currentVersion := repo.Versions[versionName]
		if currentVersion != nil {
			version.CurrentCreated = currentVersion.Created
		}

		latestVersion := repo.Versions[repo.Latest]
		if latestVersion != nil {
			version.LatestVersion = fmt.Sprintf("%s:%s", repoName, repo.Latest)
			version.LatestCreated = latestVersion.Created
		}

		if currentVersion != nil && latestVersion != nil {
			if currentVersion.Digest == latestVersion.Digest {
				version.Status = entities.UpdatesVersionUptodate
			} else {
				version.Status = entities.UpdatesVersionOutdated
			}
		}
	}

	return nil
}

func fetchRepo(ctx context.Context, repo *repository) error {
	imageRef, err := docker.ParseReference("//" + repo.Name)
	if err != nil {
		return err
	}

	switch reference.Domain(imageRef.DockerReference()) {
	case "docker.io":
		// Improved case with docker hub api
		return fetchRepoDockerHub(ctx, repo)
	default:
		return fetchRepoGeneric(ctx, repo)
	}
}
