package fetcher

import (
	"bytes"
	"path"
	"slices"

	"github.com/compose-spec/compose-go/v2/cli"
	"github.com/compose-spec/compose-go/v2/loader"
	"github.com/compose-spec/compose-go/v2/types"
)

func dockerCompose() readerBackend {
	return &dockerComposeReaderBackend{}
}

type dockerComposeReaderBackend struct {
}

func (backend *dockerComposeReaderBackend) IsProjectDir(r *reader, directory string) (bool, error) {
	projectName, err := backend.getProjectName(r, directory)
	return projectName != "", err
}

func (backend *dockerComposeReaderBackend) ProcessDir(r *reader, directory string, nodes []string) error {
	projectName, err := backend.getProjectName(r, directory)
	if err != nil {
		return err
	}

	projectPath := path.Join(directory, projectName)

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
		r.addVersion("docker-compose", append(slices.Clone(nodes), name), containerInfo.Image)
	}

	return nil
}

func (backend *dockerComposeReaderBackend) getProjectName(r *reader, directory string) (string, error) {
	projectName := ""

	for _, candidate := range cli.DefaultFileNames {
		projectFile := path.Join(directory, candidate)
		exists, err := r.fileExists(projectFile)
		if err != nil {
			return "", err
		}

		if exists {
			projectName = candidate
			break
		}
	}

	return projectName, nil
}
