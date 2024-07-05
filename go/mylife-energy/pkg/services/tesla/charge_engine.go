package tesla

import (
	"context"
	"fmt"
	"mylife-energy/pkg/entities"
	"mylife-energy/pkg/services/tesla/api"
	"mylife-energy/pkg/services/tesla/live_query"
	"mylife-energy/pkg/services/tesla/parameters"
	"mylife-tools-server/log"
	"mylife-tools-server/services/tasks"
	"mylife-tools-server/utils"
	"time"
)

type chargeEngine struct {
	worker       *utils.Worker
	ctx          context.Context
	ctxTerminate context.CancelFunc
	view         *view
	api          *api.Client
}

func makeChargeEngine(view *view, api *api.Client) *chargeEngine {
	e := &chargeEngine{
		view: view,
		api:  api,
	}

	e.ctx, e.ctxTerminate = context.WithCancel(context.Background())

	e.worker = utils.NewInterval(time.Minute, e.intervalEntry)

	return e
}

func (e *chargeEngine) terminate() {
	e.ctxTerminate()
	e.worker.Terminate()
}

func (e *chargeEngine) intervalEntry() {
	state, params, _, err := e.getData()

	if err != nil {
		logger.WithError(err).Error("Error fetching state from background")
		return
	}

	if !e.checkCharge(state, params) {
		return
	}

	switch params.currentMode {
	case entities.TeslaModeFast:
		e.setupFastCharge(state, params)

	case entities.TeslaModeSmart:
		e.setupSmartCharge(state, params)
	}
}

func (e *chargeEngine) checkCharge(state *stateData, params *parametersValues) bool {

	switch params.currentMode {
	case entities.TeslaModeOff:
		e.setChargingStatus(entities.TeslaChargingStatusDisabled)
		return false

	case entities.TeslaModeFast, entities.TeslaModeSmart:
		carState := state.Car.LastState

		if !state.WallConnector.LastState.VehicleConnected {
			e.setChargingStatus(entities.TeslaChargingStatusNotPlugged)
			return false
		} else if carState == nil {
			e.setChargingStatus(entities.TeslaChargingStatusUnknown)
			return false
		} else if carState.Status == api.Disconnected {
			e.setChargingStatus(entities.TeslaChargingStatusNotPlugged)
			return false
		} else if carState.Battery.Level >= carState.Battery.TargetLevel {
			e.setChargingStatus(entities.TeslaChargingStatusComplete)

			if params.currentMode == entities.TeslaModeFast {
				// Go back to prev mode
				e.setMode(params.fastPrevMode)
			}

			return false
		}
	}

	return true
}

func (e *chargeEngine) setupFastCharge(state *stateData, params *parametersValues) {
	// Mode fast : always max current
	current := state.Car.LastState.Charger.MaxCurrent

	e.setChargingStatus(entities.TeslaChargingStatusCharging)

	err := e.setupCharge(state, current, params.fastLimit)
	if err != nil {
		logger.WithError(err).Error("Error at charge setup")
		return
	}
}

func (e *chargeEngine) setupSmartCharge(state *stateData, params *parametersValues) {
	carState := state.Car.LastState

	if carState.Battery.Level < params.smartLimitLow {
		// Below low limit : predefined current
		current := params.smartFastCurrent

		e.setChargingStatus(entities.TeslaChargingStatusCharging)

		err := e.setupCharge(state, current, params.smartLimitHigh)
		if err != nil {
			logger.WithError(err).Error("Error at charge setup")
			return
		}

		return
	}

	current, err := e.computeSmartCurrent(state)
	if err != nil {
		logger.WithError(err).Error("Error computing smart current")
		return
	}

	if current == 0 {
		e.setChargingStatus(entities.TeslaChargingStatusNoPower)
	} else {
		e.setChargingStatus(entities.TeslaChargingStatusCharging)
	}

	err = e.setupCharge(state, current, params.smartLimitHigh)
	if err != nil {
		logger.WithError(err).Error("Error at charge setup")
		return
	}
}

// Set charging status from this background thread
func (e *chargeEngine) setChargingStatus(chargingStatus entities.TeslaChargingStatus) error {
	return tasks.RunEventLoop("tesla/charge-engine-set-charging-status", func() {
		e.view.setChargingStatus(chargingStatus)
	})
}

// Get view data from this background thread
func (e *chargeEngine) getData() (*stateData, *parametersValues, entities.TeslaChargingStatus, error) {
	var state *stateData
	var params parametersValues
	var chargingStatus entities.TeslaChargingStatus

	err := tasks.RunEventLoop("tesla/charge-engine-fetch-data", func() {
		state = e.view.dupState()

		params.currentMode = parameters.CurrentMode.Get()
		params.fastPrevMode = parameters.FastPrevMode.Get()
		params.fastLimit = int(parameters.FastLimit.Get())
		params.smartLimitLow = int(parameters.SmartLimitLow.Get())
		params.smartLimitHigh = int(parameters.SmartLimitHigh.Get())
		params.smartFastCurrent = int(parameters.SmartFastCurrent.Get())

		chargingStatus = e.view.chargingStatus
	})

	return state, &params, chargingStatus, err
}

// Set current mode from this background thread
func (e *chargeEngine) setMode(mode entities.TeslaMode) error {
	return tasks.RunEventLoop("tesla/charge-engine-set-mode", func() {
		SetMode(mode)
	})
}

func (e *chargeEngine) computeSmartCurrent(state *stateData) (int, error) {

	measures, err := live_query.QueryMainPower(e.ctx)
	if err != nil {
		return 0, err
	}

	if len(measures) == 0 {
		return 0, fmt.Errorf("no main current measure found")
	}

	mainCurrent := averageCurrent(measures)
	actualCurrent := state.Car.LastState.Charge.Current

	// Diff to target 0
	targetCurrent := actualCurrent - mainCurrent

	logger.WithFields(log.Fields{"mainCurrent": mainCurrent, "targetCurrent": targetCurrent}).Debug("Compute current")

	minCurrent := state.Car.LastState.Charge.MinCurrent
	maxCurrent := state.Car.LastState.Charge.MaxCurrent

	if targetCurrent <= 0 {
		// If target <= 0, stop charge
		targetCurrent = 0
	} else if targetCurrent < minCurrent {
		// If target is between 0 and min charger current, keep actual charging status
		if state.Car.LastState.Charge.Current == 0 {
			targetCurrent = 0
		} else {
			targetCurrent = minCurrent
		}
	} else if targetCurrent > maxCurrent {
		targetCurrent = maxCurrent
	}

	return targetCurrent, nil
}

func (e *chargeEngine) setupCharge(state *stateData, current int, limit int) error {
	if current > 0 && state.Car.Status == entities.TeslaDeviceStatusOffline {
		logger.Debug("Setup charge: wake up")
		err := e.api.Wakeup()
		if err != nil {
			return err
		}
	}

	logger.WithFields(log.Fields{"current": current, "limit": limit}).Debug("Setup charge: setting charging current")

	if err := e.api.SetupCharge(current, limit); err != nil {
		return err
	}

	return nil
}

func averageCurrent(measures []*live_query.Measure) int {
	var currentSum float64 = 0

	for _, m := range measures {
		currentSum = currentSum + m.Current
	}

	return int(currentSum / float64(len(measures)))
}
