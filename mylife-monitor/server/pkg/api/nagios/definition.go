package nagios

import (
	"mylife-monitor/pkg/entities"
	"mylife-monitor/pkg/services/nagios"
	"mylife-tools/services/api"
	"mylife-tools/services/notification"
	"mylife-tools/services/sessions"
	"mylife-tools/services/store"
)

var Definition = api.MakeDefinition("nagios", notify, notifySummary)

func notify(session *sessions.Session, arg struct{}) (uint64, error) {
	view := nagios.GetDataView()
	viewId := notification.NotifyView[store.Entity](session, view)
	return viewId, nil
}

func notifySummary(session *sessions.Session, arg struct{}) (uint64, error) {
	view := nagios.GetSummaryView()
	viewId := notification.NotifyView[*entities.NagiosSummary](session, view)
	return viewId, nil
}
