import { createSelector } from '@reduxjs/toolkit';
import { views } from 'mylife-tools';
import { getView } from './views';

export const getDisplayView = createSelector([
  getView,
  (_state, onlyProblems: boolean) => onlyProblems,
], (view, onlyProblems) => {
  if (onlyProblems) {
    view = views.filter(view, (item) => item.status !== 'uptodate');
  }

  return Object.values(view).sort((a, b) => a.path.join('/').localeCompare(b.path.join('/')));
});
