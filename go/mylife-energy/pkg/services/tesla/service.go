package tesla

import (
	"mylife-energy/pkg/entities"
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
	TokenPath            string `mapstructure:"tokenPath"`
	Id                   int64  `mapstructure:"id"`
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

	var err error
	service.state, err = makeStateManager(conf.TokenPath, conf.Id, conf.WallConnectorAddress, func() {
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
}) {
	parameters.FastLimit.Set(values.FastLimit)
	parameters.SmartLimitLow.Set(values.SmartLimitLow)
	parameters.SmartLimitHigh.Set(values.SmartLimitHigh)
	parameters.SmartFastCurrent.Set(values.SmartFastCurrent)
}
