package api

import (
	"mylife-energy/pkg/api/common"
	"mylife-energy/pkg/api/home"
	"mylife-energy/pkg/api/live"
	"mylife-energy/pkg/api/stats"
	"mylife-energy/pkg/api/tesla"
	"mylife-tools-server/services/api"
)

var Definitions = []api.ServiceDefinition{
	common.Definition,
	home.Definition,
	live.Definition,
	stats.Definition,
	tesla.Definition,
}
