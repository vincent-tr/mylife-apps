package nagios

import (
	"context"
	"encoding/base64"
	"mylife-monitor/pkg/entities"
	"mylife-monitor/pkg/services/nagios/query"
	"mylife-tools/config"
	"mylife-tools/log"
	"mylife-tools/services"
	"mylife-tools/services/store"
	"mylife-tools/services/tasks"
	"mylife-tools/utils"
	"net/url"
	"strings"
	"time"
)

var logger = log.CreateLogger("mylife:monitor:nagios")

type nagiosConfig struct {
	Url      string `mapstructure:"url"`
	User     string `mapstructure:"user"`
	Pass     string `mapstructure:"pass"`
	Interval int    `mapstructure:"interval"`
}

type nagiosService struct {
	context          context.Context
	contextTerminate func()
	refreshWorker    *utils.Worker
	authHeader       string
	baseUrl          string
	// Note: contains 3 different types: NagiosHost, NagiosService, NagiosHostGroup
	dataView    *store.Container[store.Entity]
	summaryView *store.Container[*entities.NagiosSummary]
}

func (service *nagiosService) Init(arg interface{}) error {
	conf := nagiosConfig{}
	config.BindStructure("nagios", &conf)

	service.context, service.contextTerminate = context.WithCancel(context.Background())

	service.baseUrl = conf.Url
	if !strings.HasSuffix(service.baseUrl, "/") {
		service.baseUrl += "/"
	}

	user := url.PathEscape(conf.User)
	pass := url.PathEscape(conf.Pass)
	service.authHeader = "Basic " + base64.StdEncoding.EncodeToString([]byte(user+":"+pass))

	logger.WithFields(log.Fields{"url": conf.Url, "refreshInterval": conf.Interval}).Info("Nagios API configured")

	service.dataView = store.NewContainer[store.Entity]("nagios-data")
	service.summaryView = store.NewContainer[*entities.NagiosSummary]("nagios-summary")

	service.refreshWorker = utils.NewInterval(time.Duration(conf.Interval)*time.Second, service.refresh)

	return nil
}

func (service *nagiosService) Terminate() error {
	service.contextTerminate()
	service.refreshWorker.Terminate()

	return nil
}

func (service *nagiosService) ServiceName() string {
	return "nagios"
}

func (service *nagiosService) Dependencies() []string {
	return []string{}
}

func (service *nagiosService) refresh() {

	groups, err := query.FetchHostGroupList(service.context, service.authHeader, service.baseUrl)
	if err != nil {
		logger.WithError(err).Error("Could not fetch host group list")
		return
	}

	hosts, err := query.FetchHostList(service.context, service.authHeader, service.baseUrl)
	if err != nil {
		logger.WithError(err).Error("Could not fetch host list")
		return
	}

	services, err := query.FetchServiceList(service.context, service.authHeader, service.baseUrl)
	if err != nil {
		logger.WithError(err).Error("Could not fetch service list")
		return
	}

	schema := newSchema()
	schema.addObjectHostGroupList(groups)
	schema.addStatusHostList(hosts)
	schema.addStatusServiceList(services)

	objects := schema.buildDataObjects()
	summary := schema.buildSummaryObjects()

	tasks.SubmitEventLoop("nagios/state-update", func() {
		service.dataView.ReplaceAll(objects, nagiosObjectsEqual)
		service.summaryView.ReplaceAll(summary, entities.NagiosSummariesEqual)
	})
}

func nagiosObjectsEqual(a store.Entity, b store.Entity) bool {
	switch typedA := a.(type) {
	case *entities.NagiosHostGroup:
		typedB, ok := b.(*entities.NagiosHostGroup)
		return ok && entities.NagiosHostGroupsEqual(typedA, typedB)

	case *entities.NagiosHost:
		typedB, ok := b.(*entities.NagiosHost)
		return ok && entities.NagiosHostsEqual(typedA, typedB)

	case *entities.NagiosService:
		typedB, ok := b.(*entities.NagiosService)
		return ok && entities.NagiosServicesEqual(typedA, typedB)

	default:
		return false
	}
}

func init() {
	services.Register(&nagiosService{})
}

func getService() *nagiosService {
	return services.GetService[*nagiosService]("nagios")
}

// Public access

func GetDataView() store.IContainer[store.Entity] {
	return getService().dataView
}

func GetSummaryView() store.IContainer[*entities.NagiosSummary] {
	return getService().summaryView
}
