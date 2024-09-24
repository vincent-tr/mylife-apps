package updates

import (
	"context"
	"mylife-monitor/pkg/entities"
	"mylife-monitor/pkg/services/updates/k3s"
	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"mylife-tools-server/services/store"
	"mylife-tools-server/services/tasks"
	"mylife-tools-server/utils"
	"slices"
	"strings"
	"time"
)

var logger = log.CreateLogger("mylife:monitor:updates")

type updatesConfig struct {
	GithubScriptsRepository string `mapstructure:"githubScriptsRepository"`
	GithubToken             string `mapstructure:"githubToken"`
	KubeConfig              string `mapstructure:"kubeConfig"`
	KubeServer              string `mapstructure:"kubeServer"`
	Interval                int    `mapstructure:"interval"`
}

type updatesService struct {
	context          context.Context
	contextTerminate func()
	refreshWorker    *utils.Worker
	repository       string
	ghToken          string
	kubeConfig       string
	kubeServer       string
	dataView         *store.Container[*entities.UpdatesVersion]
	summaryView      *store.Container[*entities.UpdatesSummary]
}

func (service *updatesService) Init(arg interface{}) error {
	conf := updatesConfig{}
	config.BindStructure("updates", &conf)

	service.context, service.contextTerminate = context.WithCancel(context.Background())
	service.repository = conf.GithubScriptsRepository
	service.ghToken = conf.GithubToken
	service.kubeConfig = conf.KubeConfig
	service.kubeServer = conf.KubeServer

	logger.WithFields(log.Fields{"repository": conf.GithubScriptsRepository, "refreshInterval": conf.Interval}).Info("updates watcher configured")

	service.dataView = store.NewContainer[*entities.UpdatesVersion]("updates-data")
	service.summaryView = store.NewContainer[*entities.UpdatesSummary]("updates-summary")

	service.refreshWorker = utils.NewInterval(time.Duration(conf.Interval)*time.Second, service.refresh)

	return nil
}

func (service *updatesService) Terminate() error {
	service.contextTerminate()
	service.refreshWorker.Terminate()

	return nil
}

func (service *updatesService) ServiceName() string {
	return "updates"
}

func (service *updatesService) Dependencies() []string {
	return []string{}
}

func (service *updatesService) refresh() {
	// dockerVersions, err := docker.Fetch(service.repository, service.ghToken)
	// if err != nil {
	// 	logger.WithError(err).Error("Error reading docker versions data")
	// 	return
	// }
	dockerVersions := make([]*entities.UpdatesVersionValues, 0)

	k3sVersions, err := k3s.Fetch(service.kubeConfig, service.kubeServer)
	if err != nil {
		logger.WithError(err).Error("Error reading k3s versions data")
		return
	}

	versions := slices.Concat(dockerVersions, k3sVersions)

	data, summary, err := buildEntities(versions)
	if err != nil {
		logger.WithError(err).Error("Error building entities")
		return
	}

	tasks.SubmitEventLoop("updates/state-update", func() {
		service.dataView.ReplaceAll(data, entities.UpdatesVersionsEqual)
		service.summaryView.ReplaceAll(summary, entities.UpdatesSummariesEqual)
	})
}

func init() {
	services.Register(&updatesService{})
}

func buildEntities(versions []*entities.UpdatesVersionValues) ([]*entities.UpdatesVersion, []*entities.UpdatesSummary, error) {
	data := make([]*entities.UpdatesVersion, 0)

	dockerCompose := &entities.UpdatesSummaryValues{
		Id:       "docker-compose",
		Category: "docker-compose",
	}

	k8s := &entities.UpdatesSummaryValues{
		Id:       "k8s",
		Category: "k8s",
	}

	k3sServer := &entities.UpdatesSummaryValues{
		Id:       "k3s-server",
		Category: "k3s-server",
	}

	for _, version := range versions {
		version.Id = strings.Join(version.Path, "/")
		version := entities.NewUpdatesVersion(version)
		data = append(data, version)

		switch version.Path()[0] {
		case "docker-compose":
			versionSummary(dockerCompose, version)
		case "k8s":
			versionSummary(k8s, version)
		case "k3s-server":
			versionSummary(k3sServer, version)
		}
	}

	summary := []*entities.UpdatesSummary{
		entities.NewUpdatesSummary(dockerCompose),
		entities.NewUpdatesSummary(k8s),
		entities.NewUpdatesSummary(k3sServer),
	}

	return data, summary, nil
}

func versionSummary(summary *entities.UpdatesSummaryValues, version *entities.UpdatesVersion) {
	switch version.Status() {
	case entities.UpdatesVersionUptodate:
		summary.Ok += 1

	case entities.UpdatesVersionOutdated:
		summary.Outdated += 1

	case entities.UpdatesVersionUnknown:
		summary.Unknown += 1
	}
}

func getService() *updatesService {
	return services.GetService[*updatesService]("updates")
}

// Public access

func GetDataView() store.IContainer[*entities.UpdatesVersion] {
	return getService().dataView
}

func GetSummaryView() store.IContainer[*entities.UpdatesSummary] {
	return getService().summaryView
}
