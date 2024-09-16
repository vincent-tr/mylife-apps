package api

import (
	"mylife-monitor/pkg/api/common"
	"mylife-monitor/pkg/api/nagios"
	"mylife-monitor/pkg/api/updates"
	"mylife-monitor/pkg/api/upsmon"
	"mylife-tools-server/services/api"
)

var Definitions = []api.ServiceDefinition{
	common.Definition,
	nagios.Definition,
	upsmon.Definition,
	updates.Definition,
}
