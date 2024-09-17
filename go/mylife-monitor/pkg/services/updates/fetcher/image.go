package fetcher

import (
	"context"
	"mylife-monitor/pkg/entities"
	"strings"
	"sync"
	"time"

	"github.com/containers/image/v5/docker"
	"github.com/containers/image/v5/image"
	"github.com/containers/image/v5/types"
)

type imageData struct {
	FullName string
	Digest   string
	Created  time.Time
}

func fetchImagesData(versions []*entities.UpdatesVersionValues) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*60)
	defer cancel()

	pool := MakeParallelTaskPool(ctx)

	for _, version := range versions {
		fullName := version.CurrentVersion
		split := strings.Split(fullName, ":")

		if len(split) < 2 {
			// no proper version
			continue
		}

		baseName := split[0]

		// Not very meaningfull
		version.LatestVersion = baseName + ":latest"

		pool.Add(func(ctx context.Context) error {
			return fetchContainerData(ctx, version)
		})
	}

	return pool.Wait()
}

func fetchContainerData(ctx context.Context, version *entities.UpdatesVersionValues) error {
	pool := MakeParallelTaskPool(ctx)

	current := &imageData{
		FullName: version.CurrentVersion,
	}

	latest := &imageData{
		FullName: version.LatestVersion,
	}

	for _, image := range []*imageData{current, latest} {
		pool.Add(func(ctx context.Context) error {
			return fetchImageData(ctx, image)
		})
	}

	err := pool.Wait()

	if err != nil {
		logger.WithError(err).WithField("image", version.CurrentVersion).Error("Error getting image")
		// Don't propagate errors
		return nil
	}

	version.CurrentCreated = current.Created
	version.LatestCreated = latest.Created

	if current.Digest == latest.Digest {
		version.Status = entities.UpdatesVersionUptodate
	} else {
		version.Status = entities.UpdatesVersionOutdated
	}

	return nil
}

func fetchImageData(ctx context.Context, imgData *imageData) error {
	sys := &types.SystemContext{}

	imageRef, err := docker.ParseReference("//" + imgData.FullName)
	if err != nil {
		return err
	}

	rawDigest, err := docker.GetDigest(ctx, sys, imageRef)
	if err != nil {
		return err
	}

	imgData.Digest = string(rawDigest)

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

	imgData.Created = *info.Created

	return nil
}

type ParallelTaskPool struct {
	ctx    context.Context
	cancel context.CancelFunc
	wg     sync.WaitGroup
	err    error
	errMux sync.Mutex
}

func MakeParallelTaskPool(parent context.Context) *ParallelTaskPool {
	ctx, cancel := context.WithCancel(parent)
	return &ParallelTaskPool{
		ctx:    ctx,
		cancel: cancel,
	}
}

func (pool *ParallelTaskPool) Add(task func(context.Context) error) {
	pool.wg.Add(1)

	go func() {
		defer pool.wg.Done()

		err := task(pool.ctx)
		if err != nil {
			pool.setError(err)
		}
	}()
}

func (pool *ParallelTaskPool) setError(err error) {
	pool.errMux.Lock()
	defer pool.errMux.Unlock()

	if pool.err == nil {
		pool.err = err
		// on error cancel running tasks
		pool.cancel()
	}
}

func (pool *ParallelTaskPool) Wait() error {
	pool.wg.Wait()

	pool.cancel()

	return pool.err
}
