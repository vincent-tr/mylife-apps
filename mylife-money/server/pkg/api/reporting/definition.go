package reporting

import (
	"mylife-money/pkg/business"
	"mylife-money/pkg/business/views"
	"mylife-tools-server/services/api"
	"mylife-tools-server/services/sessions"
)

var Definition = api.MakeDefinition("reporting", notifyOperationStats, notifyTotalByMonth, notifyGroupByMonth, notifyGroupByYear, exportGroupByMonth, exportGroupByYear)

func notifyOperationStats(session *sessions.Session, arg struct{}) (uint64, error) {
	viewId := business.NotifyOperationStats(session)
	return viewId, nil
}

func notifyTotalByMonth(session *sessions.Session, arg struct{}) (uint64, error) {
	viewId := business.NotifyTotalByMonth(session)
	return viewId, nil
}

func notifyGroupByMonth(session *sessions.Session, arg struct{ Criteria views.CriteriaValues }) (uint64, error) {
	return business.NotifyGroupByMonth(session, arg.Criteria)
}

func notifyGroupByYear(session *sessions.Session, arg struct{ Criteria views.CriteriaValues }) (uint64, error) {
	return business.NotifyGroupByYear(session, arg.Criteria)
}

func exportGroupByMonth(session *sessions.Session, arg struct {
	Criteria views.CriteriaValues
	Display  business.DisplayValues
}) ([]byte, error) {
	return business.ExportGroupByMonth(session, arg.Criteria, arg.Display)
}

func exportGroupByYear(session *sessions.Session, arg struct {
	Criteria views.CriteriaValues
	Display  business.DisplayValues
}) ([]byte, error) {
	return business.ExportGroupByYear(session, arg.Criteria, arg.Display)
}
