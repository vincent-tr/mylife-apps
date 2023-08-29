package api

import (
	"mylife-monitor/pkg/api/common"
	"mylife-monitor/pkg/api/nagios"
	"mylife-tools-server/services/api"
)

var Definitions = []api.ServiceDefinition{
	common.Definition,
	nagios.Definition,
}
