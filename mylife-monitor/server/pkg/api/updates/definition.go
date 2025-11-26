package updates

import (
	"mylife-monitor/pkg/entities"
	"mylife-monitor/pkg/services/updates"
	"mylife-tools/services/api"
	"mylife-tools/services/notification"
	"mylife-tools/services/sessions"
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
