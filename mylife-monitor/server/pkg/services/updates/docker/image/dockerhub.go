package image

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

	"mylife-tools/log"

	"github.com/containers/image/v5/docker"
	"github.com/containers/image/v5/docker/reference"
)

func fetchRepoDockerHub(ctx context.Context, repo *repository) error {
	// Note: we only fetch the 100 first result page. (no more paging lookup)

	imageRef, err := docker.ParseReference("//" + repo.Name)
	if err != nil {
		return err
	}

	path := reference.Path(imageRef.DockerReference())
	parts := strings.Split(path, "/")
	if len(parts) < 2 {
		return fmt.Errorf("invalid image path: %s", path)
	}
	namespace := parts[0]
	repository := parts[1]

	// Fetch image data from Docker Hub API
	url := fmt.Sprintf("https://hub.docker.com/v2/namespaces/%s/repositories/%s/tags?page_size=100", namespace, repository)
	logger.WithFields(log.Fields{"repository": repo.Name, "url": url}).Debug("Fetching image data from Docker Hub")
	resp, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("failed to fetch image data: %w", err)
	}
	defer resp.Body.Close()

	logger.WithField("repository", repo.Name).Debug("Got response")

	var tags DockerHubTagsResponse
	if err := json.NewDecoder(resp.Body).Decode(&tags); err != nil {
		return fmt.Errorf("failed to decode response: %w", err)
	}

	// Find latest
	latestTag := tags.FindTagByName("latest")
	if latestTag != nil {
		candidates := tags.FindTagsByDigest(latestTag.Digest)
		tags := make([]string, 0, len(candidates))
		for _, t := range candidates {
			tags = append(tags, t.Name)
		}
		repo.Latest = pickMostCompleteVersion(tags)

		// Add it to existing versions
		if repo.Latest != "" {
			logger.WithFields(log.Fields{"repository": repo.Name, "latest": repo.Latest}).Debug("Found latest version")
			repo.Versions[repo.Latest] = &versionData{}
		}
	}

	// Fill existing versions
	for version, data := range repo.Versions {
		tag := tags.FindTagByName(version)
		if tag != nil {
			logger.WithFields(log.Fields{"repository": repo.Name, "version": version}).Debug("Found version")
			data.Digest = tag.Digest
			data.Created = tag.LastUpdated
		}
	}

	return nil
}

// Root response
type DockerHubTagsResponse struct {
	Count    int         `json:"count"`
	Next     *string     `json:"next"`
	Previous *string     `json:"previous"`
	Results  []DockerTag `json:"results"`
}

func (result *DockerHubTagsResponse) FindTagByName(name string) *DockerTag {
	for _, tag := range result.Results {
		if tag.Name == name {
			return &tag
		}
	}
	return nil
}

func (result *DockerHubTagsResponse) FindTagsByDigest(digest string) []*DockerTag {
	tags := make([]*DockerTag, 0)
	for _, tag := range result.Results {
		if tag.Digest == digest {
			tags = append(tags, &tag)
		}
	}
	return tags
}

// Single tag entry
type DockerTag struct {
	Creator             int           `json:"creator"`
	ID                  int64         `json:"id"`
	Name                string        `json:"name"`
	Repository          int64         `json:"repository"`
	FullSize            int64         `json:"full_size"`
	V2                  bool          `json:"v2"`
	TagStatus           string        `json:"tag_status"`
	TagLastPulled       time.Time     `json:"tag_last_pulled"`
	TagLastPushed       time.Time     `json:"tag_last_pushed"`
	MediaType           string        `json:"media_type"`
	ContentType         string        `json:"content_type"`
	Digest              string        `json:"digest"`
	LastUpdated         time.Time     `json:"last_updated"`
	LastUpdater         int           `json:"last_updater"`
	LastUpdaterUsername string        `json:"last_updater_username"`
	Images              []DockerImage `json:"images"`
}

// Nested image info
type DockerImage struct {
	Architecture string    `json:"architecture"`
	Features     string    `json:"features"`
	Variant      *string   `json:"variant"`
	Digest       string    `json:"digest"`
	OS           string    `json:"os"`
	OSFeatures   string    `json:"os_features"`
	OSVersion    *string   `json:"os_version"`
	Size         int64     `json:"size"`
	Status       string    `json:"status"`
	LastPulled   time.Time `json:"last_pulled"`
	LastPushed   time.Time `json:"last_pushed"`
}

/*

Exmaple output:

{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "creator": 7483000,
      "id": 765505602,
      "images": [
        {
          "architecture": "amd64",
          "features": "",
          "variant": null,
          "digest": "sha256:755dd8586893c6ee7ebb649b1506653f036f7fe3c09e9a7f9725b21c939e4b07",
          "os": "linux",
          "os_features": "",
          "os_version": null,
          "size": 17464159,
          "status": "active",
          "last_pulled": "2025-08-29T09:30:26.034071986Z",
          "last_pushed": "2021-09-01T16:03:27Z"
        }
      ],
      "last_updated": "2024-09-30T12:03:00.807746Z",
      "last_updater": 7483000,
      "last_updater_username": "vincenttr",
      "name": "latest",
      "repository": 15269894,
      "full_size": 17464159,
      "v2": true,
      "tag_status": "active",
      "tag_last_pulled": "2025-08-29T09:30:26.034071986Z",
      "tag_last_pushed": "2024-09-30T12:03:00.807746Z",
      "media_type": "application/vnd.docker.distribution.manifest.list.v2+json",
      "content_type": "image",
      "digest": "sha256:091eb826823b707f924bbe4a453127967db71640690715401efaa18b86cdc6a4"
    },
    {
      "creator": 7483000,
      "id": 165360035,
      "images": [
        {
          "architecture": "amd64",
          "features": "",
          "variant": null,
          "digest": "sha256:755dd8586893c6ee7ebb649b1506653f036f7fe3c09e9a7f9725b21c939e4b07",
          "os": "linux",
          "os_features": "",
          "os_version": null,
          "size": 17464159,
          "status": "active",
          "last_pulled": "2025-08-29T09:30:26.034071986Z",
          "last_pushed": "2021-09-01T16:03:27Z"
        }
      ],
      "last_updated": "2024-10-02T07:18:43.79738Z",
      "last_updater": 7483000,
      "last_updater_username": "vincenttr",
      "name": "2.1.1",
      "repository": 15269894,
      "full_size": 17464159,
      "v2": true,
      "tag_status": "active",
      "tag_last_pulled": "2025-08-29T09:30:26.034071986Z",
      "tag_last_pushed": "2024-10-02T07:18:43.79738Z",
      "media_type": "application/vnd.docker.distribution.manifest.list.v2+json",
      "content_type": "image",
      "digest": "sha256:091eb826823b707f924bbe4a453127967db71640690715401efaa18b86cdc6a4"
    }
  ]
}

*/

// pickMostCompleteVersion selects the "most complete" version tag from a list of Docker image tags.
//
// Logic Overview:
//
// 1. Splitting Tags into Parts
//   - Each tag is split into parts using both '.' and '-' as delimiters.
//     For example:
//     "1.42.1.10060-4e8b05daf" -> ["1", "42", "1", "10060", "4e8b05daf"]
//     "5.2.2-apache"            -> ["5", "2", "2", "apache"]
//   - This allows us to handle semantic version numbers (major.minor.patch)
//     and extended identifiers (build numbers or commit hashes).
//
// 2. Valid Part Checking
//   - A part is considered valid if it is either:
//     a) A decimal integer (e.g., "5", "42", "10060")
//     b) A hexadecimal string (e.g., "4e8b05daf")
//   - Any part that is not valid (e.g., "apache", "latest") will cause
//     the entire tag to be discarded from consideration.
//
// 3. Candidate Selection
//   - Only tags where all parts are valid are considered candidates.
//   - Each candidate is stored along with the count of valid parts.
//   - Tags with more parts are considered "more complete".
//     Example:
//     "5.2"  -> 2 parts
//     "5.2.2" -> 3 parts
//     "1.42.1.10060-4e8b05daf" -> 5 parts
//     The tag with the highest number of parts wins.
//
// 4. Sorting and Deterministic Selection
//   - Candidates are sorted in descending order by the number of valid parts.
//   - If multiple candidates have the same number of parts, they are sorted
//     alphabetically to ensure a deterministic choice.
//   - The top candidate after sorting is returned as the "most complete" version.
//
// 5. Discarding Invalid Tags
//   - Tags with any invalid part (like "latest", "apache", or tags with flavor suffixes) are ignored.
//   - This ensures that only semantically valid version numbers are selected.
//
// 6. Usage
//   - This function is designed for Docker image tags where numeric versions
//     and optional hexadecimal identifiers are used.
//   - It can handle tags like:
//   - "5.2.2"
//   - "26.3.3-0"
//   - "1.42.1.10060-4e8b05daf"
//   - It will ignore tags like:
//   - "latest"
//   - "apache"
//   - "5.2.2-apache"
func pickMostCompleteVersion(tags []string) string {
	type candidate struct {
		original string
		count    int
	}

	candidates := []candidate{}

	for _, tag := range tags {
		// Split tag into parts by dot or dash
		parts := strings.FieldsFunc(tag, func(r rune) bool { return r == '.' || r == '-' })
		valid := true
		for _, p := range parts {
			if !isValidPart(p) {
				valid = false
				break
			}
		}
		if valid {
			candidates = append(candidates, candidate{original: tag, count: len(parts)})
		}
	}

	if len(candidates) == 0 {
		return ""
	}

	// Sort descending by number of parts, then alphabetically for deterministic result
	sort.Slice(candidates, func(i, j int) bool {
		if candidates[i].count != candidates[j].count {
			return candidates[i].count > candidates[j].count
		}
		return candidates[i].original > candidates[j].original
	})

	return candidates[0].original
}

func isValidPart(part string) bool {
	if _, err := strconv.ParseInt(part, 10, 64); err == nil {
		return true
	}
	// check if hex (allow lowercase a-f, digits)
	match, _ := regexp.MatchString("^[0-9a-fA-F]+$", part)
	return match
}
