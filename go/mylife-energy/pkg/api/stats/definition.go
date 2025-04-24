package stats

import (
	"mylife-energy/pkg/business/stats"
	"mylife-energy/pkg/entities"
	"mylife-tools-server/services/api"
	"mylife-tools-server/services/notification"
	"mylife-tools-server/services/sessions"
	"mylife-tools-server/services/store"
	"time"
)

var Definition = api.MakeDefinition("stats", getValues, notifyDevices)

type statsInput struct {
	Type      stats.StatsType
	Timestamp time.Time
	Sensors   []string
}

type statsOutput = stats.StatValues

func getValues(session *sessions.Session, arg statsInput) ([]statsOutput, error) {
	return stats.GetValues(arg.Type, arg.Timestamp, arg.Sensors)
}

func notifyDevices(session *sessions.Session, arg struct{}) (uint64, error) {
	devices, err := store.GetCollection[*entities.Device]("devices")
	if err != nil {
		return 0, err
	}

	statableDevices := store.NewView(devices, func(obj *entities.Device) bool {
		return !obj.Computed() && obj.Type() == entities.Node
	})

	viewId := notification.NotifyView(session, statableDevices)
	return viewId, nil
}
