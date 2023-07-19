package stats

import (
	"mylife-energy/pkg/business/stats"
	"mylife-tools-server/services/api"
	"mylife-tools-server/services/sessions"
	"time"
)

var Definition = api.MakeDefinition("stats", getValues)

type statsInput struct {
	Type      stats.StatsType
	Timestamp time.Time
	Sensors   []string
}

type statsOutput = stats.StatValues

func getValues(session *sessions.Session, arg statsInput) ([]statsOutput, error) {
	return stats.GetValues(arg.Type, arg.Timestamp, arg.Sensors)
}
