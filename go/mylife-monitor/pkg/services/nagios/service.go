package nagios

import (
	"mylife-monitor/pkg/entities"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"mylife-tools-server/services/store"
)

var logger = log.CreateLogger("mylife:monitor:nagios")

type nagiosService struct {
}

func (service *nagiosService) Init(arg interface{}) error {
	return nil
}

func (service *nagiosService) Terminate() error {
	return nil
}

func (service *nagiosService) ServiceName() string {
	return "nagios"
}

func (service *nagiosService) Dependencies() []string {
	return []string{}
}

func init() {
	services.Register(&nagiosService{})
}

func getService() *nagiosService {
	return services.GetService[*nagiosService]("nagios")
}

// Public access

func GetDataView() store.IContainer[store.Entity] {
	// Note: contains 3 different types: NagiosHost, NagiosService, NagiosHostGroup
	return nil
}

func GetSummaryView() store.IContainer[*entities.NagiosSummary] {
	return nil
}
