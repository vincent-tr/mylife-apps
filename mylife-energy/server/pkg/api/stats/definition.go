package stats

import (
	"mylife-energy/pkg/business/stats"
	"mylife-energy/pkg/entities"
	"mylife-tools/services/api"
	"mylife-tools/services/notification"
	"mylife-tools/services/sessions"
	"mylife-tools/services/store"
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
	devices := store.GetCollection[*entities.Device]("devices")

	statableDevices := store.NewView(devices, func(obj *entities.Device) bool {
		return !obj.Computed() && obj.Type() == entities.Node
	})

	viewId := notification.NotifyView(session, statableDevices)
	return viewId, nil
}
