package tesla

import (
	"mylife-energy/pkg/entities"
	"mylife-energy/pkg/services/tesla"
	"mylife-tools/services/api"
	"mylife-tools/services/notification"
	"mylife-tools/services/sessions"
)

var Definition = api.MakeDefinition("tesla", notifyState, setMode, setParameters)

func notifyState(session *sessions.Session, arg struct{}) (uint64, error) {
	stateView := tesla.GetStateView()
	viewId := notification.NotifyView[*entities.TeslaState](session, stateView)
	return viewId, nil
}

func setMode(session *sessions.Session, arg struct{ Mode entities.TeslaMode }) (api.NoReturn, error) {
	tesla.SetMode(arg.Mode)
	return nil, nil
}

func setParameters(session *sessions.Session, arg struct {
	FastLimit        int64
	SmartLimitLow    int64
	SmartLimitHigh   int64
	SmartFastCurrent int64
}) (api.NoReturn, error) {
	return nil, tesla.SetParameters(arg)
}
