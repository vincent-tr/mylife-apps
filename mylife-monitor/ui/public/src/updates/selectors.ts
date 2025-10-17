'use strict';

import { views, createSelector } from 'mylife-tools-ui';
import * as viewUids from './view-uids';

const getUpdates = state => state.updates;

export const getView = state => views.getView(state, viewUids.UPDATES_DATA);
export const getCriteria = state => getUpdates(state).criteria;

export const getDisplayView = createSelector(
  [ getView, getCriteria ],
  (view, criteria) => {

    if (criteria.onlyProblems) {
      return view.filter(item => item.status !== 'uptodate');
    } else {
      return view;
    }
  }
);
