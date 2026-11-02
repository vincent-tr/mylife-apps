package image

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"time"

	"mylife-tools/log"

	"github.com/containers/image/v5/docker"
	"github.com/containers/image/v5/docker/reference"
)

func fetchRepoQuay(ctx context.Context, repo *repository) error {
	// Note: we only fetch the 100 most recent active tags. Versions not found in this page are fetched individually.

	imageRef, err := docker.ParseReference("//" + repo.Name)
	if err != nil {
		return err
	}

	path := reference.Path(imageRef.DockerReference())
	if strings.Count(path, "/") < 1 {
		return fmt.Errorf("invalid image path: %s", path)
	}

	baseURL := fmt.Sprintf("https://quay.io/api/v1/repository/%s/tag/", path)

	tags, err := quayGetTags(ctx, repo.Name, baseURL+"?limit=100&onlyActiveTags=true")
	if err != nil {
		return err
	}

	// Find latest
	latestTag := tags.FindTagByName("latest")
	if latestTag == nil {
		specific, err := quayGetTags(ctx, repo.Name, baseURL+"?onlyActiveTags=true&specificTag=latest")
		if err != nil {
			return err
		}
		latestTag = specific.FindTagByName("latest")
	}

	if latestTag != nil {
		candidates := tags.FindTagsByDigest(latestTag.ManifestDigest)
		names := make([]string, 0, len(candidates))
		for _, t := range candidates {
			names = append(names, t.Name)
		}
		repo.Latest = pickMostCompleteVersion(names)
	} else {
		// No "latest" tag published (eg: jetstack/cert-manager-*), use the highest stable semver tag
		names := make([]string, 0, len(tags.Tags))
		for _, t := range tags.Tags {
			names = append(names, t.Name)
		}
		repo.Latest = pickHighestSemver(names)
	}

	if repo.Latest != "" {
		logger.WithFields(log.Fields{"repository": repo.Name, "latest": repo.Latest}).Debug("Found latest version")
		if _, ok := repo.Versions[repo.Latest]; !ok {
			repo.Versions[repo.Latest] = &versionData{}
		}
	}

	// Fill existing versions
	for version, data := range repo.Versions {
		tag := tags.FindTagByName(version)
		if tag == nil {
			// Not in the recent page, look it up directly
			specific, err := quayGetTags(ctx, repo.Name, baseURL+"?onlyActiveTags=true&specificTag="+url.QueryEscape(version))
			if err != nil {
				return err
			}
			tag = specific.FindTagByName(version)
		}

		if tag != nil {
			logger.WithFields(log.Fields{"repository": repo.Name, "version": version}).Debug("Found version")
			data.Digest = tag.ManifestDigest
			data.Created = time.Unix(tag.StartTs, 0)
		}
	}

	return nil
}

func quayGetTags(ctx context.Context, repoName string, url string) (*QuayTagsResponse, error) {
	logger.WithFields(log.Fields{"repository": repoName, "url": url}).Debug("Fetching image data from Quay")

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch image data: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status %q fetching %s", resp.Status, url)
	}

	var tags QuayTagsResponse
	if err := json.NewDecoder(resp.Body).Decode(&tags); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &tags, nil
}

type QuayTagsResponse struct {
	Page          int       `json:"page"`
	HasAdditional bool      `json:"has_additional"`
	Tags          []QuayTag `json:"tags"`
}

func (result *QuayTagsResponse) FindTagByName(name string) *QuayTag {
	for i := range result.Tags {
		if result.Tags[i].Name == name {
			return &result.Tags[i]
		}
	}
	return nil
}

func (result *QuayTagsResponse) FindTagsByDigest(digest string) []*QuayTag {
	tags := make([]*QuayTag, 0)
	for i := range result.Tags {
		if result.Tags[i].ManifestDigest == digest {
			tags = append(tags, &result.Tags[i])
		}
	}
	return tags
}

type QuayTag struct {
	Name           string `json:"name"`
	ManifestDigest string `json:"manifest_digest"`
	StartTs        int64  `json:"start_ts"`
	Size           *int64 `json:"size"`
}

var stableSemverRegexp = regexp.MustCompile(`^v?(\d+)\.(\d+)\.(\d+)$`)

// pickHighestSemver returns the highest tag of the form [v]X.Y.Z (no prerelease/suffix), or "" if none.
func pickHighestSemver(tags []string) string {
	best := ""
	var bestNums [3]int

	for _, tag := range tags {
		m := stableSemverRegexp.FindStringSubmatch(tag)
		if m == nil {
			continue
		}

		var nums [3]int
		for i := range nums {
			nums[i], _ = strconv.Atoi(m[i+1])
		}

		if best == "" || nums[0] > bestNums[0] ||
			(nums[0] == bestNums[0] && (nums[1] > bestNums[1] ||
				(nums[1] == bestNums[1] && nums[2] > bestNums[2]))) {
			best = tag
			bestNums = nums
		}
	}

	return best
}
