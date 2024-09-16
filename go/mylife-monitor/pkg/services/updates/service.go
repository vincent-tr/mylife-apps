package updates

import (
	"context"
	"mylife-monitor/pkg/entities"
	"mylife-monitor/pkg/services/updates/fetcher"
	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"mylife-tools-server/services/store"
	"mylife-tools-server/services/tasks"
	"mylife-tools-server/utils"
	"time"
)

var logger = log.CreateLogger("mylife:monitor:updates")

type updatesConfig struct {
	GithubScriptsRepository string `mapstructure:"githubScriptsRepository"`
	GithubToken             string `mapstructure:"githubToken"`
	Interval                int    `mapstructure:"interval"`
}

type updatesService struct {
	context          context.Context
	contextTerminate func()
	refreshWorker    *utils.Worker
	repository       string
	ghToken          string
	dataView         *store.Container[*entities.UpdatesVersion]
	summaryView      *store.Container[*entities.UpdatesSummary]
}

func (service *updatesService) Init(arg interface{}) error {
	conf := updatesConfig{}
	config.BindStructure("updates", &conf)

	service.context, service.contextTerminate = context.WithCancel(context.Background())
	service.repository = conf.GithubScriptsRepository
	service.ghToken = conf.GithubToken

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
	versions, err := fetcher.Fetch(service.repository, service.ghToken)
	if err != nil {
		logger.WithError(err).Error("Error reading versions data")
		return
	}

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
	summary := make([]*entities.UpdatesSummary, 0)

	dockerCompose := &entities.UpdatesSummaryValues{
		Id:       "docker-compose",
		Category: "docker compose",
	}

	for _, version := range versions {
		version := entities.NewUpdatesVersion(version)
		data = append(data, version)

		switch version.Status() {
		case entities.UpdatesVersionUptodate:
			dockerCompose.Ok += 1

		case entities.UpdatesVersionOutdated:
			dockerCompose.Outdated += 1

		case entities.UpdatesVersionUnknown:
			dockerCompose.Unknown += 1
		}
	}

	summary = append(summary, entities.NewUpdatesSummary(dockerCompose))

	return data, summary, nil
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
