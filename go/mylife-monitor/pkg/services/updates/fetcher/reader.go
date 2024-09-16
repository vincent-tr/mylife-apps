package fetcher

import (
	"bytes"
	"errors"
	"fmt"
	"log"
	"mylife-monitor/pkg/entities"
	"os"
	"path"

	"github.com/go-git/go-billy/v5"

	"github.com/compose-spec/compose-go/v2/cli"
	"github.com/compose-spec/compose-go/v2/loader"
	"github.com/compose-spec/compose-go/v2/types"
)

func readFiles(root string, fs billy.Filesystem) ([]*entities.UpdatesVersionValues, error) {
	reader := &reader{
		root:     root,
		fs:       fs,
		versions: make([]*entities.UpdatesVersionValues, 0),
	}

	if err := reader.processRoot(); err != nil {
		return nil, err
	}

	return reader.versions, nil
}

type reader struct {
	root     string
	fs       billy.Filesystem
	versions []*entities.UpdatesVersionValues
}

func (r *reader) processRoot() error {
	entries, err := r.fs.ReadDir(r.root)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}

		serverName := entry.Name()

		err = r.processServer(serverName)
		if err != nil {
			return err
		}
	}

	return nil
}

func (r *reader) processServer(serverName string) error {

	entries, err := r.fs.ReadDir(path.Join(r.root, serverName))
	if err != nil {
		log.Fatal(err)
	}

	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}

		serviceName := entry.Name()

		if err := r.processService(serverName, serviceName); err != nil {
			return err
		}
	}

	return nil
}

func (r *reader) processService(serverName string, serviceName string) error {
	projectName := ""

	for _, candidate := range cli.DefaultFileNames {
		projectFile := path.Join(r.root, serverName, serviceName, candidate)
		exists, err := r.fileExists(projectFile)
		if err != nil {
			return err
		}

		if exists {
			projectName = candidate
			break
		}
	}

	if projectName != "" {
		if err := r.processComposeDir(serverName, serviceName, projectName); err != nil {
			return fmt.Errorf("error processing dir '%s': %w", path.Join(r.root, serverName, serviceName), err)
		}
	}

	return nil
}

func (r *reader) processComposeDir(serverName string, serviceName string, projectName string) error {

	projectPath := path.Join(r.root, serverName, serviceName, projectName)

	file, err := r.fs.Open(projectPath)
	if err != nil {
		return err
	}

	buffer := &bytes.Buffer{}
	_, err = buffer.ReadFrom(file)
	if err != nil {
		return err
	}

	logger.WithField("projectPath", projectPath).Debug("Read compose project")

	details := types.ConfigDetails{
		ConfigFiles: []types.ConfigFile{
			{
				Filename: projectPath,
				Content:  buffer.Bytes(),
			},
		},
	}

	nameOption := func(opt *loader.Options) {
		opt.SetProjectName(projectName, false)
		opt.SkipResolveEnvironment = true
	}

	project, err := loader.Load(details, nameOption)
	if err != nil {
		return err
	}

	for name, containerInfo := range project.Services {
		version := &entities.UpdatesVersionValues{
			Path:           []string{serverName, serviceName, name},
			CurrentVersion: containerInfo.Image,
			Status:         entities.UpdatesVersionUnknown,
		}

		r.versions = append(r.versions, version)
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
