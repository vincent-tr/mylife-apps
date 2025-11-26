package live

import (
	"mylife-energy/pkg/entities"
	"mylife-energy/pkg/services/live"
	"mylife-tools/services/api"
	"mylife-tools/services/notification"
	"mylife-tools/services/sessions"
)

var Definition = api.MakeDefinition("live", notifyMeasures, notifyDevices)

func notifyMeasures(session *sessions.Session, arg struct{}) (uint64, error) {
	measures := live.GetMeasures()
	viewId := notification.NotifyView[*entities.Measure](session, measures)
	return viewId, nil
}

func notifyDevices(session *sessions.Session, arg struct{}) (uint64, error) {
	devices := live.GetDevices()
	viewId := notification.NotifyView[*entities.LiveDevice](session, devices)
	return viewId, nil
}
