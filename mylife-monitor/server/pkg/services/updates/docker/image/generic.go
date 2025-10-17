package image

import (
	"context"
	"fmt"

	"github.com/containers/image/v5/docker"
	"github.com/containers/image/v5/image"
	"github.com/containers/image/v5/types"
)

func fetchRepoGeneric(ctx context.Context, repo *repository) error {
	// fetch repo versions digests data, a ":latest"

	repo.Versions["latest"] = &versionData{}
	repo.Latest = "latest"

	for version, data := range repo.Versions {
		name := repo.Name + ":" + version

		if err := fetchImageData(ctx, name, data); err != nil {
			return fmt.Errorf("error fetching image data for %q: %w", name, err)
		}
	}

	return nil
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
