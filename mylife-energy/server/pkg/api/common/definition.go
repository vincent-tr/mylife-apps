package common

import (
	"mylife-tools/services/api"
	"mylife-tools/services/notification"
	"mylife-tools/services/sessions"
)

var Definition = api.MakeDefinition("common", unnotify)

func unnotify(session *sessions.Session, arg struct{ ViewId uint64 }) (api.NoReturn, error) {
	notification.UnnotifyView(session, arg.ViewId)
	return nil, nil
}
