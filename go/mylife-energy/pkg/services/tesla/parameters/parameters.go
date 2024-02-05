package parameters

import (
	"mylife-energy/pkg/entities"
	"mylife-tools-server/services/parameter"
)

type teslaModeConverter struct {
}

func (*teslaModeConverter) DataToPublic(value int64) entities.TeslaMode {
	return entities.TeslaMode(value)
}

func (*teslaModeConverter) PublicToData(value entities.TeslaMode) int64 {
	return int64(value)
}

var _ parameter.Converter[int64, entities.TeslaMode] = (*teslaModeConverter)(nil)

var CurrentMode = parameter.NewParameter[int64, entities.TeslaMode]("tesla-current-mode", entities.TeslaModeOff, &teslaModeConverter{})
var FastPrevMode = parameter.NewParameter[int64, entities.TeslaMode]("tesla-fast-prev-mode", entities.TeslaModeOff, &teslaModeConverter{})
var FastLimit = parameter.NewParameter("tesla-fast-limit", 95, parameter.NewIdentityConverter[int64]())
var SmartLimitLow = parameter.NewParameter("tesla-smart-limit-low", 50, parameter.NewIdentityConverter[int64]())
var SmartLimitHigh = parameter.NewParameter("tesla-smart-limit-high", 80, parameter.NewIdentityConverter[int64]())
var SmartFastCurrent = parameter.NewParameter("tesla-smart-fast-current", 32, parameter.NewIdentityConverter[int64]())
