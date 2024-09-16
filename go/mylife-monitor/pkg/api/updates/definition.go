package updates

import (
	"mylife-monitor/pkg/entities"
	"mylife-monitor/pkg/services/updates"
	"mylife-tools-server/services/api"
	"mylife-tools-server/services/notification"
	"mylife-tools-server/services/sessions"
)

var Definition = api.MakeDefinition("updates", notify, notifySummary)

func notify(session *sessions.Session, arg struct{}) (uint64, error) {
	view := updates.GetDataView()
	viewId := notification.NotifyView[*entities.UpdatesVersion](session, view)
	return viewId, nil
}

func notifySummary(session *sessions.Session, arg struct{}) (uint64, error) {
	view := updates.GetSummaryView()
	viewId := notification.NotifyView[*entities.UpdatesSummary](session, view)
	return viewId, nil
}
