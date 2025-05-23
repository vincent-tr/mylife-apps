package business

import (
	"fmt"
	"mylife-money/pkg/business/views"
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/notification"
	"mylife-tools-server/services/sessions"
	"mylife-tools-server/services/store"
)

func RenotifyWithCriteria(session *sessions.Session, viewId uint64, criteria views.CriteriaValues) error {
	view, err := notification.GetUntypedView(session, viewId)
	if err != nil {
		return err
	}

	viewWithCriteria, ok := view.(views.ViewWithCriteria)
	if !ok {
		return fmt.Errorf("View does not support criteria: %T", view)
	}

	return viewWithCriteria.SetCriteriaValues(criteria)
}

func NotifyOperations(session *sessions.Session, criteria views.CriteriaValues) (uint64, error) {
	view := views.MakeOperationView()

	if err := view.SetCriteriaValues(criteria); err != nil {
		return 0, err
	}

	viewId := notification.NotifyView(session, view)
	return viewId, nil
}

func NotifyOperationStats(session *sessions.Session) uint64 {
	view := store.GetMaterializedView[*entities.ReportOperationStat]("operation-stats")
	viewId := notification.NotifyView(session, view)
	return viewId
}

func NotifyTotalByMonth(session *sessions.Session) uint64 {
	view := store.GetMaterializedView[*entities.ReportTotalByMonth]("total-by-month")
	viewId := notification.NotifyView(session, view)
	return viewId
}

func NotifyGroupByMonth(session *sessions.Session, criteria views.CriteriaValues) (uint64, error) {
	view := views.MakeGroupByMonth()

	if err := view.(views.ViewWithCriteria).SetCriteriaValues(criteria); err != nil {
		return 0, err
	}

	viewId := notification.NotifyView(session, view)
	return viewId, nil
}

func NotifyGroupByYear(session *sessions.Session, criteria views.CriteriaValues) (uint64, error) {
	view := views.MakeGroupByYear()

	if err := view.(views.ViewWithCriteria).SetCriteriaValues(criteria); err != nil {
		return 0, err
	}

	viewId := notification.NotifyView(session, view)
	return viewId, nil
}
