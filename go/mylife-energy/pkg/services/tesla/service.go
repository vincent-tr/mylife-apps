package tesla

import (
	"fmt"
	"mylife-energy/pkg/entities"
	"mylife-energy/pkg/services/tesla/api"
	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"mylife-tools-server/services/store"
)

/*

3 modes de pilotage
- off => pas de pilotage de la charge
- fast => charge au max possible du chargeur des que branchement
- smart => charge avec le surplus des panneaux solaires pendant la journee uniquement

*/

var logger = log.CreateLogger("mylife:energy:tesla")

type teslaConfig struct {
	TokenPath            string `mapstructure:"tokenPath"`
	VIN                  string `mapstructure:"vin"`
	HomeLocation         string `mapstructure:"homeLocation"` // 'latitude longitude'
	WallConnectorAddress string `mapstructure:"wallConnectorAddress"`
}

type teslaService struct {
	state  *stateManager
	view   *view
	engine *chargeEngine
}

func (service *teslaService) Init(arg interface{}) error {
	conf := teslaConfig{}
	config.BindStructure("tesla", &conf)

	homeLocation, err := api.ParsePosition(conf.HomeLocation)
	if err != nil {
		return fmt.Errorf("parse home location: %w", err)
	}

	logger.Debugf("Home position: %+v", homeLocation)

	service.state, err = makeStateManager(conf.TokenPath, conf.VIN, homeLocation, conf.WallConnectorAddress, func() {
		service.view.stateUpdate(&service.state.data)
	})

	if err != nil {
		return err
	}

	service.view = makeView(&service.state.data)
	service.engine = makeChargeEngine(service.view, service.state.api)

	return nil
}

func (service *teslaService) Terminate() error {
	service.engine.terminate()
	service.engine = nil

	service.state.terminate()
	service.state = nil

	service.view = nil

	return nil
}

func (service *teslaService) ServiceName() string {
	return "tesla"
}

func (service *teslaService) Dependencies() []string {
	return []string{"tasks", "query"}
}

func init() {
	services.Register(&teslaService{})
}

func getService() *teslaService {
	return services.GetService[*teslaService]("tesla")
}

// Public access

func GetStateView() store.IContainer[*entities.TeslaState] {
	return getService().view.view
}

func SetMode(mode entities.TeslaMode) {
	getService().view.setMode(mode)
}
