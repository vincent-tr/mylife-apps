import { getNotifiedView } from 'mylife-tools-server';

export function renotifyWithCriteria(session, viewId, criteria) {
  const view = getNotifiedView(session, viewId);
  view.setCriteria(criteria);
}
