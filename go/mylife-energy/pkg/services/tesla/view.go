package tesla

import (
	"mylife-energy/pkg/entities"
	"mylife-tools-server/services/store"
	"mylife-tools-server/services/tasks"
	"time"

	"github.com/gookit/goutil/errorx/panics"
)

type view struct {
	view           *store.Container[*entities.TeslaState]
	state          *stateData
	mode           entities.TeslaMode
	chargingStatus entities.TeslaChargingStatus
}

const viewStateId = "unique"

func makeView(state *stateData) *view {
	v := &view{
		view:           store.NewContainer[*entities.TeslaState]("tesla-state"),
		state:          state,
		mode:           entities.TeslaModeOff,
		chargingStatus: entities.TeslaChargingStatusUnknown,
	}

	v.view.Set(entities.NewTeslaState(&entities.TeslaStateData{
		Id:   viewStateId,
		Mode: v.mode,
	}))

	return v
}

func (v *view) stateUpdate(state *stateData) {
	v.state = state
	v.updateStateView()
}

func (v *view) updateStateView() {
	oldState, err := v.view.Get(viewStateId)
	panics.IsNil(err)

	newState := entities.UpdateTeslaState(oldState, func(data *entities.TeslaStateData) {
		data.Mode = v.mode
		data.ChargingStatus = v.chargingStatus

		data.LastUpdate = v.state.Car.Timestamp
		data.WallConnectorStatus = v.state.WallConnector.Status
		data.CarStatus = v.state.Car.Status
		data.ChargingStatus = entities.TeslaChargingStatusDisabled // TODO

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

func (v *view) setMode(mode entities.TeslaMode) {
	if v.mode == mode {
		return
	}

	v.mode = mode
	v.updateStateView()
}

// Get view data from other queue than event loop
func (v *view) getDataFromBackground() (*stateData, entities.TeslaMode, entities.TeslaChargingStatus, error) {
	var state *stateData
	var mode entities.TeslaMode
	var chargingStatus entities.TeslaChargingStatus

	err := tasks.RunEventLoop("tesla/view-fetch-data", func() {
		state = v.dupState()
		mode = v.mode
		chargingStatus = v.chargingStatus
	})

	return state, mode, chargingStatus, err
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

// Set charging status from other queue than event loop
func (v *view) setChargingStatusFromBackground(chargingStatus entities.TeslaChargingStatus) error {
	return tasks.RunEventLoop("tesla/view-set-charging-status", func() {
		v.setChargingStatus(chargingStatus)
	})
}
