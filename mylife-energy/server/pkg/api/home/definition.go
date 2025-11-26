package home

import (
	"mylife-energy/pkg/business/home"
	"mylife-energy/pkg/entities"
	"mylife-tools/services/api"
	"mylife-tools/services/notification"
	"mylife-tools/services/sessions"
)

var Definition = api.MakeDefinition("home", notifyHomeData)

func notifyHomeData(session *sessions.Session, arg struct{}) (uint64, error) {
	homeDataView := home.GetView()
	viewId := notification.NotifyView[*entities.HomeData](session, homeDataView)
	return viewId, nil
}
