package api

import (
	"fmt"
	"mylife-energy/pkg/business/stats"
	"mylife-tools-server/services/api"
	"mylife-tools-server/services/sessions"
	"time"
)

// jour -> toutes les 15 mins
// mois -> tous les jours
// annee -> tous les mois

var statsDef = api.MakeDefinition("stats", getValues)

type statsInput struct {
	Type      stats.StatsType
	Timestamp time.Time
	Sensors   []string
}

type statsOutput = stats.StatValues

func getValues(session *sessions.Session, arg statsInput) ([]statsOutput, error) {
	a, b := stats.GetValues(arg.Type, arg.Timestamp, arg.Sensors)
	fmt.Printf("+%v +%v\n", a, b)
	return a, b
}
