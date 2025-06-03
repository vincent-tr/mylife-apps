package business

import (
	"fmt"
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/notification"
	"mylife-tools-server/services/sessions"
	"mylife-tools-server/services/store"
)

func NotifyBots(session *sessions.Session) uint64 {
	view := store.GetMaterializedView[*entities.Bot]("bots")
	viewId := notification.NotifyView(session, view)
	return viewId
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

func GetAccountId(code string) (string, error) {
	accounts := store.GetCollection[*entities.Account]("accounts")

	list := accounts.Filter(func(a *entities.Account) bool {
		return a.Code() == code
	})

	if len(list) == 0 {
		return "", fmt.Errorf("account %s not found", code)
	}

	if len(list) > 1 {
		return "", fmt.Errorf("multiple accounts found for code %s", code)
	}

	return list[0].Id(), nil
}
