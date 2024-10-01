package updates

import (
	"context"
	"mylife-monitor/pkg/entities"
	"mylife-monitor/pkg/services/updates/docker"
	"mylife-monitor/pkg/services/updates/k3s"
	"mylife-monitor/pkg/services/updates/unifi"
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
	UnifiController         string `mapstructure:"unificontroller"`
	UnifiUser               string `mapstructure:"unifiUser"`
	UnifiPass               string `mapstructure:"unifiPass"`
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
	unifiController  string
	unifiUser        string
	unifiPass        string
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
	service.unifiController = conf.UnifiController
	service.unifiUser = conf.UnifiUser
	service.unifiPass = conf.UnifiPass

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
	dockerVersions, err := docker.Fetch(service.repository, service.ghToken)
	if err != nil {
		logger.WithError(err).Error("Error reading docker versions data")
		return
	}

	k3sVersions, err := k3s.Fetch(service.kubeConfig, service.kubeServer)
	if err != nil {
		logger.WithError(err).Error("Error reading k3s versions data")
		return
	}

	unifiVersions, err := unifi.Fetch(service.unifiController, service.unifiUser, service.unifiPass)
	if err != nil {
		logger.WithError(err).Error("Error reading unifi versions data")
		return
	}

	versions := slices.Concat(dockerVersions, k3sVersions, unifiVersions)

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

	summaryValues := make(map[string]*entities.UpdatesSummaryValues)

	for _, version := range versions {
		version.Id = strings.Join(version.Path, "/")
		version := entities.NewUpdatesVersion(version)
		data = append(data, version)

		versionSummary(summaryValues, version)
	}

	summary := make([]*entities.UpdatesSummary, 0)

	for _, values := range summaryValues {
		summary = append(summary, entities.NewUpdatesSummary(values))
	}

	return data, summary, nil
}

func versionSummary(summaryValues map[string]*entities.UpdatesSummaryValues, version *entities.UpdatesVersion) {
	category := version.Path()[0]
	summary, found := summaryValues[category]
	if !found {
		summary = &entities.UpdatesSummaryValues{
			Id:       category,
			Category: category,
		}

		summaryValues[category] = summary
	}

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
