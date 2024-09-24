package docker

import (
	"bytes"
	"fmt"
	"io"
	"path"
	"slices"
	"strings"

	goyaml "github.com/go-yaml/yaml"
	appsv1 "k8s.io/api/apps/v1"
	"k8s.io/client-go/kubernetes/scheme"
)

func k8s() readerBackend {
	return &k8sReaderBackend{}
}

type k8sReaderBackend struct {
}

func (backend *k8sReaderBackend) IsProjectDir(r *reader, directory string) (bool, error) {
	// Note: this one should be run after docker compose
	sources, err := backend.getSources(r, directory)
	if err != nil {
		return false, err
	}

	return len(sources) > 0, nil
}

func (backend *k8sReaderBackend) ProcessDir(r *reader, directory string, nodes []string) error {
	sources, err := backend.getSources(r, directory)
	if err != nil {
		return err
	}

	for _, source := range sources {
		filePath := path.Join(directory, source)
		name := strings.TrimSuffix(source, path.Ext(source))
		newNodes := append(slices.Clone(nodes), name)

		if err := backend.processFile(r, filePath, newNodes); err != nil {
			return err
		}
	}

	return nil
}

func (backend *k8sReaderBackend) getSources(r *reader, directory string) ([]string, error) {
	entries, err := r.fs.ReadDir(directory)
	if err != nil {
		return nil, fmt.Errorf("error reading directory '%s': %w", directory, err)
	}

	sources := make([]string, 0)

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		ext := path.Ext(entry.Name())
		if ext == ".yaml" || ext == ".yml" {
			sources = append(sources, entry.Name())
		}
	}

	return sources, nil
}

func (backend *k8sReaderBackend) processFile(r *reader, filePath string, nodes []string) error {
	// read and split per resource

	file, err := r.fs.Open(filePath)
	if err != nil {
		return err
	}

	buffer := &bytes.Buffer{}
	_, err = buffer.ReadFrom(file)
	if err != nil {
		return err
	}

	// https://gist.github.com/yanniszark/c6f347421a1eeb75057ff421e03fd57c
	dec := goyaml.NewDecoder(buffer)

	for {
		var value interface{}
		err := dec.Decode(&value)
		if err == io.EOF {
			break
		}
		if err != nil {
			return err
		}

		resource, err := goyaml.Marshal(value)
		if err != nil {
			return err
		}

		if err := backend.processResource(r, resource, nodes); err != nil {
			return err
		}
	}

	return nil
}

func (backend *k8sReaderBackend) processResource(r *reader, resource []byte, nodes []string) error {
	// https://gist.github.com/PrasadG193/20c4bb375bc776f3e1f5585391eb030b
	manifests := string(resource)
	decode := scheme.Codecs.UniversalDeserializer().Decode
	for _, spec := range strings.Split(manifests, "---") {
		if len(spec) == 0 {
			continue
		}
		obj, _, err := decode([]byte(spec), nil, nil)
		if err != nil {
			continue
		}

		deployment, ok := obj.(*appsv1.Deployment)
		// ignore other types
		if ok {
			if err := backend.processDeployment(r, deployment, nodes); err != nil {
				return err
			}
		}
	}

	return nil

}

func (backend *k8sReaderBackend) processDeployment(r *reader, deployment *appsv1.Deployment, nodes []string) error {

	nodes = append(slices.Clone(nodes), deployment.GetNamespace(), deployment.GetName())

	for _, container := range deployment.Spec.Template.Spec.Containers {
		r.addVersion("k8s", append(slices.Clone(nodes), container.Name), container.Image)
	}
	return nil
}
