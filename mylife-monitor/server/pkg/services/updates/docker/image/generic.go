package image

import (
	"context"
	"fmt"
	"regexp"
	"slices"
	"sort"
	"strconv"
	"strings"

	"mylife-tools/log"

	"github.com/containers/image/v5/docker"
	"github.com/containers/image/v5/image"
	"github.com/containers/image/v5/types"
)

// Number of most recent version-like tags whose digest is compared with the one of "latest"
const genericMaxCandidates = 15

var dottedVersionRegexp = regexp.MustCompile(`^v?\d+(\.\d+)*$`)

// Generic implementation for any OCI registry (ghcr.io, ...) using the OCI distribution API,
// anonymous tokens are handled by containers/image.
// Tags list has no date nor digest, so we sort version-like tags and compare digests of the most recent ones with "latest".
func fetchRepoGeneric(ctx context.Context, repo *repository) error {
	sys := &types.SystemContext{}

	imageRef, err := docker.ParseReference("//" + repo.Name)
	if err != nil {
		return err
	}

	latestData := &versionData{}
	latestErr := fetchImageData(ctx, repo.Name+":latest", latestData)

	tags, err := docker.GetRepositoryTags(ctx, sys, imageRef)
	if err != nil {
		return fmt.Errorf("error listing tags: %w", err)
	}

	candidates := make([]string, 0)
	for _, tag := range tags {
		if dottedVersionRegexp.MatchString(tag) {
			candidates = append(candidates, tag)
		}
	}
	sort.Slice(candidates, func(i, j int) bool { return compareDottedVersions(candidates[i], candidates[j]) > 0 })

	// "latest" may point to an old release (eg: major-only tag), always consider the versions in use
	for version := range repo.Versions {
		if !slices.Contains(candidates, version) && dottedVersionRegexp.MatchString(version) {
			candidates = append(candidates, version)
		}
	}

	if latestErr == nil {
		matching := make([]string, 0)
		if len(candidates) > genericMaxCandidates {
			candidates = capCandidates(candidates, repo.Versions)
		}

		for _, tag := range candidates {
			digest, err := docker.GetDigest(ctx, sys, mustParse(repo.Name+":"+tag))
			if err != nil {
				return fmt.Errorf("error fetching digest of %q: %w", tag, err)
			}
			if string(digest) == latestData.Digest {
				matching = append(matching, tag)
			}
		}

		repo.Latest = pickMostCompleteVersion(matching)
	} else {
		logger.WithError(latestErr).WithField("repository", repo.Name).Debug("No latest tag, using highest version")
		repo.Latest = pickHighestSemver(tags)
	}

	if repo.Latest == "" {
		return fmt.Errorf("unable to find latest version")
	}

	logger.WithFields(log.Fields{"repository": repo.Name, "latest": repo.Latest}).Debug("Found latest version")

	if _, ok := repo.Versions[repo.Latest]; !ok {
		repo.Versions[repo.Latest] = &versionData{}
	}

	for version, data := range repo.Versions {
		name := repo.Name + ":" + version
		if err := fetchImageData(ctx, name, data); err != nil {
			return fmt.Errorf("error fetching image data for %q: %w", name, err)
		}
	}

	return nil
}

func mustParse(name string) types.ImageReference {
	ref, err := docker.ParseReference("//" + name)
	if err != nil {
		panic(err)
	}
	return ref
}

// compareDottedVersions compares versions like v1.2.3 numerically
func compareDottedVersions(a, b string) int {
	pa := strings.Split(strings.TrimPrefix(a, "v"), ".")
	pb := strings.Split(strings.TrimPrefix(b, "v"), ".")

	for i := 0; i < len(pa) || i < len(pb); i++ {
		var na, nb int
		if i < len(pa) {
			na, _ = strconv.Atoi(pa[i])
		}
		if i < len(pb) {
			nb, _ = strconv.Atoi(pb[i])
		}
		if na != nb {
			if na > nb {
				return 1
			}
			return -1
		}
	}
	return 0
}

func fetchImageData(ctx context.Context, name string, data *versionData) error {
	sys := &types.SystemContext{}

	imageRef, err := docker.ParseReference("//" + name)
	if err != nil {
		return err
	}

	rawDigest, err := docker.GetDigest(ctx, sys, imageRef)
	if err != nil {
		return err
	}

	imageSrc, err := imageRef.NewImageSource(ctx, sys)
	if err != nil {
		return err
	}

	img, err := image.FromUnparsedImage(ctx, sys, image.UnparsedInstance(imageSrc, nil))
	if err != nil {
		return err
	}

	info, err := img.Inspect(ctx)
	if err != nil {
		return err
	}

	data.Digest = string(rawDigest)
	data.Created = *info.Created

	return nil
}

// capCandidates keeps the most recent candidates (list is sorted, newest first) plus the versions in use
func capCandidates(candidates []string, inUse map[string]*versionData) []string {
	result := slices.Clone(candidates[:genericMaxCandidates])
	for _, tag := range candidates[genericMaxCandidates:] {
		if inUse[tag] != nil {
			result = append(result, tag)
		}
	}
	return result
}
