package tesla

import (
	"fmt"
	"mylife-energy/pkg/entities"
	"mylife-energy/pkg/services/tesla/api"
	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"mylife-tools-server/services/store"
	"time"

	"github.com/gookit/goutil/errorx/panics"
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
	state          *stateManager
	stateView      *store.Container[*entities.TeslaState]
	engine         *chargeEngine
	mode           entities.TeslaMode
	chargingStatus entities.TeslaChargingStatus
}

const viewStateId = "unique"

func (service *teslaService) Init(arg interface{}) error {
	conf := teslaConfig{}
	config.BindStructure("tesla", &conf)

	homeLocation, err := api.ParsePosition(conf.HomeLocation)
	if err != nil {
		return fmt.Errorf("Parse home location: %w", err)
	}

	logger.Debugf("Home position: %+v", homeLocation)

	service.stateView = store.NewContainer[*entities.TeslaState]("tesla-state")
	service.stateView.Set(entities.NewTeslaState(&entities.TeslaStateData{
		Id:   viewStateId,
		Mode: service.mode,
	}))

	service.state, err = makeStateManager(conf.TokenPath, conf.VIN, homeLocation, conf.WallConnectorAddress, service.stateUpdate)
	if err != nil {
		return err
	}

	service.engine = makeChargeEngine()

	return nil
}

func (service *teslaService) Terminate() error {
	service.engine.terminate()
	service.engine = nil

	service.state.terminate()
	service.state = nil

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

func (service *teslaService) stateUpdate() {
	service.updateStateView()
}

func (service *teslaService) updateStateView() {
	oldState, err := service.stateView.Get(viewStateId)
	panics.IsNil(err)

	newState := entities.UpdateTeslaState(oldState, func(data *entities.TeslaStateData) {
		data.Mode = service.mode
		data.ChargingStatus = service.chargingStatus

		stateData := &service.state.data

		data.LastUpdate = stateData.Car.Timestamp
		data.WallConnectorStatus = stateData.WallConnector.Status
		data.CarStatus = stateData.Car.Status
		data.ChargingStatus = entities.TeslaChargingStatusDisabled // TODO

		carLastState := stateData.Car.LastState

		if carLastState == nil {
			data.ChargingCurrent = 0
			data.ChargingPower = 0
			data.BatteryLastTimestamp = time.Time{}
			data.BatteryLevel = 0
			data.BatteryTargetLevel = 0
		} else {
			data.ChargingCurrent = carLastState.Charger.Current
			data.ChargingPower = carLastState.Charger.Power
			data.BatteryLastTimestamp = carLastState.Timestamp
			data.BatteryLevel = carLastState.Battery.Level
			data.BatteryTargetLevel = carLastState.Battery.TargetLevel
		}
	})

	service.stateView.Set(newState)
}

func (service *teslaService) canCharge() bool {
	stateData := &service.state.data
	carState := stateData.Car.LastState

	if !stateData.WallConnector.LastState.VehicleConnected {
		service.setChargingStatus(entities.TeslaChargingStatusNotPlugged)
		return false
	} else if carState == nil {
		service.setChargingStatus(entities.TeslaChargingStatusUnknown)
		return false
	} else if !carState.AtHome {
		service.setChargingStatus(entities.TeslaChargingStatusNotAtHome)
		return false
	} else if carState.Status == api.Disconnected {
		service.setChargingStatus(entities.TeslaChargingStatusNotPlugged)
		return false
	} else if carState.Battery.Level >= carState.Battery.TargetLevel {
		service.setChargingStatus(entities.TeslaChargingStatusComplete)
		return false
	}

	return true
}

/*
	func (service *teslaService) canCharge() entities.TeslaChargingStatus {
		switch service.mode {
		case entities.TeslaModeOff:
			return entities.TeslaChargingStatusDisabled
		case entities.TeslaModeFast:
			case entities.
		}
	}
*/
func (service *teslaService) setChargingStatus(chargingStatus entities.TeslaChargingStatus) {
	if service.chargingStatus == chargingStatus {
		return
	}

	service.chargingStatus = chargingStatus
	service.updateStateView()
}

func (service *teslaService) setMode(mode entities.TeslaMode) {
	if service.mode == mode {
		return
	}

	service.mode = mode
	service.updateStateView()
}

func getService() *teslaService {
	return services.GetService[*teslaService]("tesla")
}

// Public access

func GetStateView() store.IContainer[*entities.TeslaState] {
	return getService().stateView
}

func SetMode(mode entities.TeslaMode) {
	getService().setMode(mode)
}
