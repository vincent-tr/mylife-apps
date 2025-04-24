package api

import (
	"mylife-money/pkg/api/common"
	"mylife-money/pkg/api/management"
	"mylife-tools-server/services/api"
)

var Definitions = []api.ServiceDefinition{
	common.Definition,
	management.Definition,
}
