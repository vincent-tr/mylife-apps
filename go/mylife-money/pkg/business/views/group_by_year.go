package views

import (
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/store"
)

func MakeGroupByYear() store.IView[*entities.ReportGroupByPeriod] {
	return makeGroupByPeriod("report-group-by-year", yearRange, dateToYear)
}
