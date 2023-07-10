package tesla

import (
	"context"
	"mylife-energy/pkg/entities"
	"mylife-energy/pkg/services/tesla/api"
	"mylife-tools-server/log"
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
	state, mode, _, err := e.view.getDataFromBackground()

	if err != nil {
		logger.WithError(err).Error("Error fetching state from background")
		return
	}

	switch mode {
	case entities.TeslaModeOff:
		e.view.setChargingStatusFromBackground(entities.TeslaChargingStatusDisabled)
		return

	case entities.TeslaModeFast, entities.TeslaModeSmart:
		carState := state.Car.LastState

		if !state.WallConnector.LastState.VehicleConnected {
			e.view.setChargingStatusFromBackground(entities.TeslaChargingStatusNotPlugged)
			return
		} else if carState == nil {
			e.view.setChargingStatusFromBackground(entities.TeslaChargingStatusUnknown)
			return
		} else if !carState.AtHome {
			e.view.setChargingStatusFromBackground(entities.TeslaChargingStatusNotAtHome)
			return
		} else if carState.Status == api.Disconnected {
			e.view.setChargingStatusFromBackground(entities.TeslaChargingStatusNotPlugged)
			return
		} else if carState.Battery.Level >= carState.Battery.TargetLevel {
			e.view.setChargingStatusFromBackground(entities.TeslaChargingStatusComplete)
			return
		}
	}

	switch mode {
	case entities.TeslaModeFast:
		// Mode fast : always max current
		current := state.Car.LastState.Charger.MaxCurrent

		e.view.setChargingStatusFromBackground(entities.TeslaChargingStatusCharging)

		err := e.setupCharge(state, current)
		if err != nil {
			logger.WithError(err).Error("Error at charge setup")
			return
		}

	case entities.TeslaModeSmart:
		current, err := e.computeSmartCurrent(state)
		if err != nil {
			logger.WithError(err).Error("Error computing smart current")
			return
		}

		if current == 0 {
			e.view.setChargingStatusFromBackground(entities.TeslaChargingStatusNoPower)
		} else {
			e.view.setChargingStatusFromBackground(entities.TeslaChargingStatusCharging)
		}

		err = e.setupCharge(state, current)
		if err != nil {
			logger.WithError(err).Error("Error at charge setup")
			return
		}
	}
}

func (e *chargeEngine) computeSmartCurrent(state *stateData) (int, error) {

	measures, err := queryPower(e.ctx)
	if err != nil {
		return 0, err
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

func (e *chargeEngine) setupCharge(state *stateData, current int) error {
	if current > 0 && state.Car.Status == entities.TeslaDeviceStatusOffline {
		logger.Debug("Setup charge: wake up")
		err := e.api.Wakeup()
		if err != nil {
			return err
		}
	}

	logger.WithField("current", current).Debug("Setup charge: setting charging current")
	return e.api.SetChargingCurrent(current)
}

func averageCurrent(measures []*mainMeasure) int {
	var currentSum float64 = 0

	for _, m := range measures {
		currentSum = currentSum + m.current
	}

	return int(currentSum / float64(len(measures)))
}
