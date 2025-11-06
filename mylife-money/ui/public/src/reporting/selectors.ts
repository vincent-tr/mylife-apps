import { createSelector } from 'reselect';
import { io } from 'mylife-tools-ui';

type FIXME_any = any;

export const getViewId = (state) => state.reporting.view;
export const getView = state => io.getView(state, getViewId(state));
export const getViewList = state => io.getViewList(state, getViewId(state));

// sort on id, should be usefull with report's custom keys
export const getSortedViewList = createSelector(
  [ getViewList ],
  (items: FIXME_any[]) => {
    const ret = Array.from(items);
    ret.sort((item1, item2) => item1._id < item2._id ? -1 : 1);
    return ret;
  }
);
