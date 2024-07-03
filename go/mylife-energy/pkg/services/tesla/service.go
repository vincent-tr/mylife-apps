package tesla

import (
	"fmt"
	"mylife-energy/pkg/entities"
	"mylife-energy/pkg/services/tesla/api"
	"mylife-energy/pkg/services/tesla/parameters"
	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"mylife-tools-server/services/store"
)

/*

3 modes de pilotage
- off => pas de pilotage de la charge
- fast => charge au max possible du chargeur des que branchement, jusqu'à charge complete puis retour au mode précédent
- smart => charge avec le surplus des panneaux solaires pendant la journee uniquement (avec une limite basse ou on est en fast)

*/

var logger = log.CreateLogger("mylife:energy:tesla")

type teslaConfig struct {
	// Must contain fleet-api.token, owner-api.token, vehicle-private-key.pem
	AuthPath             string `mapstructure:"authPath"`
	FleetClientId        string `mapstructure:"fleetClientId"`
	Id                   int64  `mapstructure:"id"`
	VIN                  string `mapstructure:"vin"`
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

	apiConf := &api.Config{
		AuthPath:      conf.AuthPath,
		FleetClientId: conf.FleetClientId,
		Id:            conf.Id,
		VIN:           conf.VIN,
	}

	var err error
	service.state, err = makeStateManager(apiConf, conf.WallConnectorAddress, func() {
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

	service.view.terminate()
	service.view = nil

	return nil
}

func (service *teslaService) ServiceName() string {
	return "tesla"
}

func (service *teslaService) Dependencies() []string {
	return []string{"tasks", "query", "parameter"}
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
	prevMode := parameters.CurrentMode.Get()

	if prevMode == mode {
		return
	}

	parameters.CurrentMode.Set(mode)

	if mode == entities.TeslaModeFast {
		parameters.FastPrevMode.Set(prevMode)
	} else {
		parameters.FastPrevMode.Set(entities.TeslaModeOff)
	}
}

func SetParameters(values struct {
	FastLimit        int64
	SmartLimitLow    int64
	SmartLimitHigh   int64
	SmartFastCurrent int64
}) error {
	if values.FastLimit < 0 || values.FastLimit > 100 {
		return fmt.Errorf("invalid fast limit value %d (value must be between 0 and 100)", values.FastLimit)
	}

	if values.SmartLimitLow < 0 || values.SmartLimitLow > 100 {
		return fmt.Errorf("invalid smart limit low value %d (value must be between 0 and 100)", values.SmartLimitLow)
	}

	if values.SmartLimitHigh < 0 || values.SmartLimitHigh > 100 {
		return fmt.Errorf("invalid smart limit high value %d (value must be between 0 and 100)", values.SmartLimitHigh)
	}

	if values.SmartFastCurrent < 1 || values.SmartFastCurrent > 32 {
		return fmt.Errorf("invalid smart fast current value %d (value must be between 1 and 32)", values.SmartFastCurrent)
	}

	if values.SmartLimitLow >= values.SmartLimitHigh {
		return fmt.Errorf("invalid smart limit values (low value '%d' must be less than high value '%d')", values.SmartLimitLow, values.SmartLimitHigh)
	}

	parameters.FastLimit.Set(values.FastLimit)
	parameters.SmartLimitLow.Set(values.SmartLimitLow)
	parameters.SmartLimitHigh.Set(values.SmartLimitHigh)
	parameters.SmartFastCurrent.Set(values.SmartFastCurrent)

	return nil
}
