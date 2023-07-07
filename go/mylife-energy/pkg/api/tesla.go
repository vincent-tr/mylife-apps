package api

import (
	"mylife-energy/pkg/entities"
	"mylife-energy/pkg/services/tesla"
	"mylife-tools-server/services/api"
	"mylife-tools-server/services/notification"
	"mylife-tools-server/services/sessions"
)

var teslaDef = api.MakeDefinition("tesla", notifyState, setMode)

func notifyState(session *sessions.Session, arg struct{}) (uint64, error) {
	stateView := tesla.GetStateView()
	viewId := notification.NotifyView[*entities.TeslaState](session, stateView)
	return viewId, nil
}

func setMode(session *sessions.Session, arg struct{ Mode entities.TeslaMode }) (api.NoReturn, error) {
	tesla.SetMode(arg.Mode)
	return nil, nil
}
