package common

import (
	"mylife-tools-server/services/api"
	"mylife-tools-server/services/notification"
	"mylife-tools-server/services/sessions"
)

var Definition = api.MakeDefinition("common", unnotify) // , notifyAccounts, notifyGroups)

func unnotify(session *sessions.Session, arg struct{ ViewId uint64 }) (api.NoReturn, error) {
	notification.UnnotifyView(session, arg.ViewId)
	return nil, nil
}

/*

export const notifyAccounts = [ base, (session/*, message* /) => {
  return business.notifyAccounts(session);
} ];

export const notifyGroups = [ base, (session/*, message* /) => {
  return business.notifyGroups(session);
} ];

export const renotifyWithCriteria = [ base, (session, message) => {
  const { viewId, ...criteria } = message;
  return business.renotifyWithCriteria(session, viewId, criteria);
} ];

*/
