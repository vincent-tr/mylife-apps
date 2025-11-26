package common

import (
	"mylife-money/pkg/business"
	"mylife-money/pkg/business/views"
	"mylife-tools/services/api"
	"mylife-tools/services/notification"
	"mylife-tools/services/sessions"
)

var Definition = api.MakeDefinition("common", unnotify, renotifyWithCriteria, notifyAccounts, notifyGroups)

func unnotify(session *sessions.Session, arg struct{ ViewId uint64 }) (api.NoReturn, error) {
	notification.UnnotifyView(session, arg.ViewId)
	return nil, nil
}

func renotifyWithCriteria(session *sessions.Session, arg struct {
	ViewId   uint64
	Criteria views.CriteriaValues
}) (api.NoReturn, error) {
	if err := business.RenotifyWithCriteria(session, arg.ViewId, arg.Criteria); err != nil {
		return nil, err
	}

	return nil, nil
}

func notifyAccounts(session *sessions.Session, arg struct{}) (uint64, error) {
	viewId := business.NotifyAccounts(session, arg)
	return viewId, nil
}

func notifyGroups(session *sessions.Session, arg struct{}) (uint64, error) {
	viewId := business.NotifyGroups(session, arg)
	return viewId, nil
}
