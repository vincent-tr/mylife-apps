import { io, createSelector } from 'mylife-tools-ui';

type FIXME_any = any;

export const getRunsViewId = (state) => state.bots.runsView;
export const getRunsView = state => io.getView(state, getRunsViewId(state));
export const getRunsViewList = state => io.getViewList(state, getRunsViewId(state));

export const getSortedRunsViewList = createSelector(
  [ getRunsViewList ],
  (runs: FIXME_any[]) => {
    const sortedRuns = Array.from(runs);
    sortedRuns.sort((run1, run2) => run1.start.valueOf() < run2.start.valueOf() ? 1 : -1); // most recent first
    return sortedRuns;
  }
);
