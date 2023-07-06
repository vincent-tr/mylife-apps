package tesla

import (
	"context"
	"fmt"
	"mylife-energy/pkg/services/tesla/api"
	"mylife-energy/pkg/services/tesla/wall_connector"
	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"mylife-tools-server/utils"
	"time"
)

var logger = log.CreateLogger("mylife:energy:tesla")

type teslaConfig struct {
	TokenPath            string `mapstructure:"tokenPath"`
	VIN                  string `mapstructure:"vin"`
	HomeLocation         string `mapstructure:"homeLocation"` // 'latitude longitude'
	WallConnectorAddress string `mapstructure:"wallConnectorAddress"`
}

type teslaService struct {
	api              *api.Client
	wallConnector    *wall_connector.Client
	context          context.Context
	contextTerminate func()
	worker           *utils.Worker
}

func (service *teslaService) Init(arg interface{}) error {
	conf := teslaConfig{}
	config.BindStructure("tesla", &conf)

	homeLocation, err := api.ParsePosition(conf.HomeLocation)
	if err != nil {
		return fmt.Errorf("Parse home location: %w", err)
	}

	logger.Debugf("Home position: %+v", homeLocation)

	service.context, service.contextTerminate = context.WithCancel(context.Background())

	service.api, err = api.MakeClient(service.context, conf.TokenPath, conf.VIN, homeLocation)
	if err != nil {
		return err
	}

	service.wallConnector = wall_connector.MakeClient(service.context, conf.WallConnectorAddress)

	service.worker = utils.NewWorker(service.workerEntry)

	return nil
}

func (service *teslaService) Terminate() error {
	service.contextTerminate()
	service.worker.Terminate()

	service.api = nil
	service.wallConnector = nil

	return nil
}

func (service *teslaService) ServiceName() string {
	return "tesla"
}

func (service *teslaService) Dependencies() []string {
	return []string{}
}

func init() {
	services.Register(&teslaService{})
}

func (service *teslaService) workerEntry(exit chan struct{}) {

	for {
		select {
		case <-exit:
			return
		case <-time.After(10 * time.Second):
			service.fetch()
		}
	}
}

func (service *teslaService) fetch() {
	chargeData, err := service.api.FetchChargeData()
	if err != nil {
		logger.WithError(err).Error("Could not api.FetchChargeData")
		return
	}

	wcData, err := service.wallConnector.FetchData()
	if err != nil {
		logger.WithError(err).Error("Could not wallConnector.FetchData")
		return
	}

	logger.Debugf("%+v\n", chargeData)
	logger.Debugf("%+v\n", wcData)
}
