package views

import (
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/store"
)

func MakeGroupByMonth() (store.IView[*entities.ReportGroupByPeriod], error) {
	return makeGroupByPeriod("report-group-by-month", monthRange, DateToMonth)
}
