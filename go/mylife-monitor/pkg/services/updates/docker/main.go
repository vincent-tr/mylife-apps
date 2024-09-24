package docker

import (
	"mylife-monitor/pkg/entities"

	"github.com/go-git/go-billy/v5/memfs"
	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing/transport/http"
	"github.com/go-git/go-git/v5/storage/memory"

	"mylife-tools-server/log"
)

// github.com/containers/image => pacman -S btrfs-progs

var logger = log.CreateLogger("mylife:monitor:updates:fetcher")

func Fetch(repository string, token string) ([]*entities.UpdatesVersionValues, error) {
	repo, err := git.Clone(memory.NewStorage(), memfs.New(), &git.CloneOptions{
		URL: repository,
		Auth: &http.BasicAuth{
			Username: "abc123", // yes, this can be anything except an empty string
			Password: token,
		},
	})

	if err != nil {
		return nil, err
	}

	gitRef, err := repo.Head()
	if err != nil {
		return nil, err
	}

	logger.WithField("ref", gitRef.Hash()).Info("Got head commit")

	wt, err := repo.Worktree()
	if err != nil {
		return nil, err
	}

	versions, err := readFiles(wt.Filesystem.Root(), wt.Filesystem)
	if err != nil {
		return nil, err
	}

	err = fetchImagesData(versions)
	if err != nil {
		return nil, err
	}

	logger.WithField("count", len(versions)).Info("Got versions")

	return versions, nil
}
