package business

import (
	"fmt"
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/notification"
	"mylife-tools-server/services/sessions"
	"mylife-tools-server/services/store"
)

func NotifyBots(session *sessions.Session) (uint64, error) {
	view, err := store.GetMaterializedView[*entities.Bot]("bots")
	if err != nil {
		return 0, err
	}

	viewId := notification.NotifyView(session, view)
	return viewId, nil
}

var botStartHandler func(entities.BotType) error

func SetBotStartHandler(handler func(entities.BotType) error) {
	botStartHandler = handler
}

func ResetBotStartHandler() {
	botStartHandler = nil
}

func StartBot(id string) error {
	// Note: entities.BotType(typ) == string(id) for bots, cf bots view
	typ := entities.BotType(id)

	handler := botStartHandler
	if handler == nil {
		return fmt.Errorf("Bot start handler not set")
	}

	return handler(typ)
}
