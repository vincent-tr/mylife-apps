package live

import (
	"mylife-energy/pkg/entities"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"mylife-tools-server/services/store"
)

var logger = log.CreateLogger("mylife:energy:live")

type liveService struct {
	fetcher *fetcher
	merger  *merger
}

func (service *liveService) Init(arg interface{}) error {
	service.fetcher = makeFetcher()
	service.merger = makeMerger(service.fetcher.measures, service.fetcher.sensors)

	return nil
}

func (service *liveService) Terminate() error {
	service.merger.terminate()
	service.merger = nil

	service.fetcher.terminate()
	service.fetcher = nil

	return nil
}

func (service *liveService) ServiceName() string {
	return "live"
}

func (service *liveService) Dependencies() []string {
	return []string{"query", "tasks", "store"}
}

func init() {
	services.Register(&liveService{})
}

func getService() *liveService {
	return services.GetService[*liveService]("live")
}

// Public access

func GetDevices() store.IContainer[*entities.LiveDevice] {
	return getService().merger.liveDevices
}

func GetMeasures() store.IContainer[*entities.Measure] {
	return getService().merger.liveMeasures
}
