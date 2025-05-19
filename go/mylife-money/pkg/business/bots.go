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

func StartBot(id string) error {
	return fmt.Errorf("Not implemented")
}
