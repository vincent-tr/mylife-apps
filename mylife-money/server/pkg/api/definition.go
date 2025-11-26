package api

import (
	"mylife-money/pkg/api/bots"
	"mylife-money/pkg/api/common"
	"mylife-money/pkg/api/management"
	"mylife-money/pkg/api/reporting"
	"mylife-tools/services/api"
)

var Definitions = []api.ServiceDefinition{
	common.Definition,
	management.Definition,
	reporting.Definition,
	bots.Definition,
}
