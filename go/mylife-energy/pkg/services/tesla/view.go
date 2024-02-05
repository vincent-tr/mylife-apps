package tesla

import (
	"mylife-energy/pkg/entities"
	"mylife-energy/pkg/services/tesla/parameters"
	"mylife-tools-server/services/store"
	"mylife-tools-server/services/tasks"
	"time"

	"github.com/gookit/goutil/errorx/panics"
)

type view struct {
	view                 *store.Container[*entities.TeslaState]
	state                *stateData
	chargingStatus       entities.TeslaChargingStatus
	parameterModeChanged func(event *entities.TeslaMode)
	parameterIntChanged  func(event *int64)
}

const ViewStateId = "unique"

func makeView(state *stateData) *view {
	v := &view{
		view:           store.NewContainer[*entities.TeslaState]("tesla-state"),
		state:          state,
		chargingStatus: entities.TeslaChargingStatusUnknown,
	}

	v.view.Set(entities.NewTeslaState(&entities.TeslaStateData{
		Id:               ViewStateId,
		Mode:             parameters.CurrentMode.Get(),
		FastLimit:        parameters.FastLimit.Get(),
		SmartLimitLow:    parameters.SmartLimitLow.Get(),
		SmartLimitHigh:   parameters.SmartLimitHigh.Get(),
		SmartFastCurrent: parameters.SmartFastCurrent.Get(),
		ChargingStatus:   v.chargingStatus,
	}))

	v.parameterModeChanged = func(_ *entities.TeslaMode) {
		v.updateStateView()
	}

	v.parameterIntChanged = func(_ *int64) {
		v.updateStateView()
	}

	parameters.CurrentMode.AddListener(&v.parameterModeChanged)
	parameters.FastLimit.AddListener(&v.parameterIntChanged)
	parameters.SmartLimitLow.AddListener(&v.parameterIntChanged)
	parameters.SmartLimitHigh.AddListener(&v.parameterIntChanged)
	parameters.SmartFastCurrent.AddListener(&v.parameterIntChanged)

	return v
}

func (v *view) terminate() {
	parameters.CurrentMode.RemoveListener(&v.parameterModeChanged)
	parameters.FastLimit.RemoveListener(&v.parameterIntChanged)
	parameters.SmartLimitLow.RemoveListener(&v.parameterIntChanged)
	parameters.SmartLimitHigh.RemoveListener(&v.parameterIntChanged)
	parameters.SmartFastCurrent.RemoveListener(&v.parameterIntChanged)
}

func (v *view) stateUpdate(state *stateData) {
	v.state = state
	v.updateStateView()
}

func (v *view) updateStateView() {
	oldState, err := v.view.Get(ViewStateId)
	panics.IsNil(err)

	newState := entities.UpdateTeslaState(oldState, func(data *entities.TeslaStateData) {
		data.Mode = parameters.CurrentMode.Get()
		data.FastLimit = parameters.FastLimit.Get()
		data.SmartLimitLow = parameters.SmartLimitLow.Get()
		data.SmartLimitHigh = parameters.SmartLimitHigh.Get()
		data.SmartFastCurrent = parameters.SmartFastCurrent.Get()

		data.ChargingStatus = v.chargingStatus

		data.LastUpdate = v.state.Car.Timestamp
		data.WallConnectorStatus = v.state.WallConnector.Status
		data.CarStatus = v.state.Car.Status
		data.ChargingStatus = v.chargingStatus

		carLastState := v.state.Car.LastState

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

	v.view.Set(newState)
}

func (v *view) setChargingStatus(chargingStatus entities.TeslaChargingStatus) {
	if v.chargingStatus == chargingStatus {
		return
	}

	v.chargingStatus = chargingStatus
	v.updateStateView()
}

type parametersValues struct {
	currentMode      entities.TeslaMode
	fastPrevMode     entities.TeslaMode
	fastLimit        int
	smartLimitLow    int
	smartLimitHigh   int
	smartFastCurrent int
}

// Get view data from other queue than event loop
func (v *view) getDataFromBackground() (*stateData, parametersValues, entities.TeslaChargingStatus, error) {
	var state *stateData
	var params parametersValues
	var chargingStatus entities.TeslaChargingStatus

	err := tasks.RunEventLoop("tesla/view-fetch-data", func() {
		state = v.dupState()

		params.currentMode = parameters.CurrentMode.Get()
		params.fastPrevMode = parameters.FastPrevMode.Get()
		params.fastLimit = int(parameters.FastLimit.Get())
		params.smartLimitLow = int(parameters.SmartLimitLow.Get())
		params.smartLimitHigh = int(parameters.SmartLimitHigh.Get())
		params.smartFastCurrent = int(parameters.SmartFastCurrent.Get())

		chargingStatus = v.chargingStatus
	})

	return state, params, chargingStatus, err
}

func (v *view) dupState() *stateData {
	source := v.state
	target := &stateData{}

	*target = *source
	if source.Car.LastState != nil {
		*target.Car.LastState = *source.Car.LastState
	}

	if source.WallConnector.LastState != nil {
		*target.WallConnector.LastState = *source.WallConnector.LastState
	}

	return target
}
