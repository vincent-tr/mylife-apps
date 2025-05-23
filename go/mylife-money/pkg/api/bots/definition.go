package bots

import (
	"mylife-money/pkg/business"
	"mylife-tools-server/log"
	"mylife-tools-server/services/api"
	"mylife-tools-server/services/sessions"
)

var logger = log.CreateLogger("mylife:money:api:bots")

var Definition = api.MakeDefinition("bots", notifyBots, startBot)

func notifyBots(session *sessions.Session, arg struct{}) (uint64, error) {
	viewId := business.NotifyBots(session)
	return viewId, nil
}

func startBot(session *sessions.Session, arg struct{ Id string }) (api.NoReturn, error) {
	err := business.StartBot(arg.Id)
	if err != nil {
		return nil, err
	}

	logger.Infof("bot started: %s", arg.Id)
	return nil, nil
}
