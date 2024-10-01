package docker

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

type versionUpdater struct {
	version *entities.UpdatesVersionValues
	current *imageData
	latest  *imageData
}

func makeVersionUpdater(version *entities.UpdatesVersionValues) *versionUpdater {
	return &versionUpdater{version: version}
}

func (vu *versionUpdater) GetFullNames() []string {
	return []string{
		vu.version.CurrentVersion,
		vu.version.LatestVersion,
	}
}

func (vu *versionUpdater) SetImageData(data *imageData) {
	if vu.version.CurrentVersion == data.FullName {
		vu.current = data
	}

	if vu.version.LatestVersion == data.FullName {
		vu.latest = data
	}
}

func (vu *versionUpdater) Update() {
	if vu.current != nil {
		vu.version.CurrentCreated = vu.current.Created
	}

	if vu.latest != nil {
		vu.version.LatestCreated = vu.latest.Created
	}

	if vu.current != nil && vu.latest != nil {
		if vu.current.Digest == vu.latest.Digest {
			vu.version.Status = entities.UpdatesVersionUptodate
		} else {
			vu.version.Status = entities.UpdatesVersionOutdated
		}
	}
}

// avoid dict lock
type imgDataWrapper struct {
	data *imageData
}

func fetchImagesData(versions []*entities.UpdatesVersionValues) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*60)
	defer cancel()

	updaters := make([]*versionUpdater, 0)

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

		updaters = append(updaters, makeVersionUpdater(version))
	}

	// Note: we avoid to fetch multiple time same image
	imgData := make(map[string]*imgDataWrapper)

	for _, updater := range updaters {
		for _, name := range updater.GetFullNames() {
			imgData[name] = &imgDataWrapper{}
		}
	}

	pool := MakeParallelTaskPool(ctx)

	for name, wrapper := range imgData {
		pool.Add(func(ctx context.Context) error {
			if err := fetchImageData(ctx, name, wrapper); err != nil {
				logger.WithError(err).WithField("image", name).Error("Error getting image data")
			}
			return nil
		})
	}

	if err := pool.Wait(); err != nil {
		return err
	}

	for _, wrapper := range imgData {
		for _, updater := range updaters {
			updater.SetImageData(wrapper.data)
		}
	}

	for _, updater := range updaters {
		updater.Update()
	}

	return nil
}

func fetchImageData(ctx context.Context, name string, wrapper *imgDataWrapper) error {
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

	wrapper.data = &imageData{
		FullName: name,
		Digest:   string(rawDigest),
		Created:  *info.Created,
	}

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
