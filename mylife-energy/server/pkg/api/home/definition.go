package home

import (
	"mylife-energy/pkg/business/home"
	"mylife-energy/pkg/entities"
	"mylife-tools-server/services/api"
	"mylife-tools-server/services/notification"
	"mylife-tools-server/services/sessions"
)

var Definition = api.MakeDefinition("home", notifyHomeData)

func notifyHomeData(session *sessions.Session, arg struct{}) (uint64, error) {
	homeDataView := home.GetView()
	viewId := notification.NotifyView[*entities.HomeData](session, homeDataView)
	return viewId, nil
}
