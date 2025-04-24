package business

import (
	"fmt"
	"mylife-money/pkg/business/views"
	"mylife-tools-server/services/notification"
	"mylife-tools-server/services/sessions"
)

// const { notifyView, getNotifiedView, getStoreMaterializedView } = require('mylife-tools-server');
// const { OperationView } = require('./views/operation-view');
// const { GroupByMonth } = require('./views/group-by-month');
// const { GroupByYear } = require('./views/group-by-year');

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
	view, err := views.MakeOperationView()
	if err != nil {
		return 0, err
	}

	view.SetCriteriaValues(criteria)

	viewId := notification.NotifyView(session, view)
	return viewId, nil
}

/*
export function notifyOperationStats(session) {
  const view = getStoreMaterializedView('operation-stats').createView();
  return notifyView(session, view);
}

export function notifyTotalByMonth(session) {
  const view = getStoreMaterializedView('total-by-month').createView();
  return notifyView(session, view);
}

export function notifyGroupByMonth(session, criteria) {
  const view = new GroupByMonth();
  view.setCriteria(criteria);
  return notifyView(session, view);
}

export function notifyGroupByYear(session, criteria) {
  const view = new GroupByYear();
  view.setCriteria(criteria);
  return notifyView(session, view);
}
*/
