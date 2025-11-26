package upsmon

import (
	"mylife-monitor/pkg/entities"
	"mylife-monitor/pkg/services/upsmon"
	"mylife-tools/services/api"
	"mylife-tools/services/notification"
	"mylife-tools/services/sessions"
)

var Definition = api.MakeDefinition("upsmon", notify, notifySummary)

func notify(session *sessions.Session, arg struct{}) (uint64, error) {
	view := upsmon.GetDataView()
	viewId := notification.NotifyView[*entities.UpsmonStatus](session, view)
	return viewId, nil
}

func notifySummary(session *sessions.Session, arg struct{}) (uint64, error) {
	view := upsmon.GetSummaryView()
	viewId := notification.NotifyView[*entities.UpsmonSummary](session, view)
	return viewId, nil
}
