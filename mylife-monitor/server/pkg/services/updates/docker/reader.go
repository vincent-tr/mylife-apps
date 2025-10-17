package docker

import (
	"errors"
	"fmt"
	"mylife-monitor/pkg/entities"
	"os"
	"path"
	"slices"

	"github.com/go-git/go-billy/v5"
)

func readFiles(root string, fs billy.Filesystem) ([]*entities.UpdatesVersionValues, error) {
	reader := &reader{
		root:     root,
		fs:       fs,
		versions: make([]*entities.UpdatesVersionValues, 0),
		backends: []readerBackend{
			// order is important
			dockerCompose(),
			k8s(),
		},
	}

	if err := reader.processDir(reader.root, []string{}); err != nil {
		return nil, err
	}

	return reader.versions, nil
}

type readerBackend interface {
	IsProjectDir(r *reader, directory string) (bool, error)
	ProcessDir(r *reader, directory string, nodes []string) error
}
type reader struct {
	root     string
	fs       billy.Filesystem
	versions []*entities.UpdatesVersionValues
	backends []readerBackend
}

func (r *reader) processDir(directory string, nodes []string) error {
	for _, backend := range r.backends {
		isBackend, err := backend.IsProjectDir(r, directory)
		if err != nil {
			return err
		}
		if isBackend {
			return backend.ProcessDir(r, directory, nodes)
		}
	}

	entries, err := r.fs.ReadDir(directory)
	if err != nil {
		return fmt.Errorf("error reading directory '%s': %w", directory, err)
	}

	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}

		newDirectory := path.Join(directory, entry.Name())
		newNodes := append(slices.Clone(nodes), entry.Name())

		if err := r.processDir(newDirectory, newNodes); err != nil {
			return err
		}
	}

	return nil
}

func (r *reader) fileExists(path string) (bool, error) {
	_, err := r.fs.Stat(path)
	if err == nil {
		return true, nil
	}
	if errors.Is(err, os.ErrNotExist) {
		return false, nil
	}

	var def bool
	return def, err
}

func (r *reader) addVersion(category string, nodes []string, version string) {
	newVersion := &entities.UpdatesVersionValues{
		Path:           slices.Concat([]string{category}, nodes),
		CurrentVersion: version,
		Status:         entities.UpdatesVersionUnknown,
	}

	r.versions = append(r.versions, newVersion)
}
