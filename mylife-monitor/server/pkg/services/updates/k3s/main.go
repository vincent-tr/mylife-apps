package k3s

import (
	"context"
	"mylife-monitor/pkg/entities"
	"mylife-tools/log"
	"time"

	"github.com/google/go-github/v65/github"
	"k8s.io/client-go/discovery"
	"k8s.io/client-go/tools/clientcmd"
)

var logger = log.CreateLogger("mylife:monitor:updates:k3s")

func Fetch(kubeConfig string, kubeServer string) ([]*entities.UpdatesVersionValues, error) {
	version := &entities.UpdatesVersionValues{
		Path:   []string{"k3s-server"},
		Status: entities.UpdatesVersionUnknown,
	}

	isError := false

	if err := gihubLatest(version); err != nil {
		logger.WithError(err).Error("could not get github latest version")
		isError = true
	}

	if err := kubeActual(version, kubeConfig, kubeServer); err != nil {
		logger.WithError(err).Error("could not get kube actual version")
		isError = true
	}

	if !isError {
		if version.CurrentVersion == version.LatestVersion {
			version.Status = entities.UpdatesVersionUptodate
		} else {
			version.Status = entities.UpdatesVersionOutdated
		}
	}

	return []*entities.UpdatesVersionValues{version}, nil
}

func gihubLatest(version *entities.UpdatesVersionValues) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*60)
	defer cancel()

	client := github.NewClient(nil)

	release, response, err := client.Repositories.GetLatestRelease(ctx, "k3s-io", "k3s")
	if err != nil {
		return err
	}

	logger.WithField("response", response).Debug("Got github API response")

	version.LatestVersion = *release.Name
	version.LatestCreated = release.CreatedAt.Time
	return nil
}

func kubeActual(version *entities.UpdatesVersionValues, kubeConfig string, kubeServer string) error {
	config, err := clientcmd.BuildConfigFromFlags("", kubeConfig)
	if err != nil {
		return err
	}

	if kubeServer != "" {
		config.Host = kubeServer
		// Cert only work as local
		config.CAData = nil
		config.Insecure = true
	}

	discoveryClient, err := discovery.NewDiscoveryClientForConfig(config)
	if err != nil {
		return err
	}

	information, err := discoveryClient.ServerVersion()
	if err != nil {
		return err
	}

	created, err := time.Parse(time.RFC3339, information.BuildDate)
	if err != nil {
		return err
	}

	version.CurrentVersion = information.GitVersion
	version.CurrentCreated = created
	return nil
}
