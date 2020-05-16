'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getHome = state => state.home;
export const getViewId = state => getHome(state).viewId;
const getView = state => io.getView(state, getViewId(state));
export const getCriteria = state => getHome(state).criteria;
export const getDisplay = state => getHome(state).display;

export const getDisplayView = createSelector(
  [ getView, getDisplay ],
  (view, display) => {
    const { sortField, sortOrder } = display;
    const sourceArray = view.valueSeq().toArray();
    if(!sortField) {
      return sourceArray;
    }

    const comparerFactory = comparerFactories[sortField];
    if(!comparerFactory) {
      throw new Error(`Unsupported sort field: '${sortField}'`);
    }

    const order = orderNumerics[sortOrder];
    if(order === undefined) {
      throw new Error(`Unsupported sort order: '${sortOrder}'`);
    }

    const comparer = comparerFactory(order);
    const array = Array.from(sourceArray);
    array.sort(comparer);
    return array;
  }
);

const orderNumerics = {
  asc: 1,
  desc: -1
};

const comparerFactories = {
  title: createTitleComparer,
  docCount: createDocCountComparer
};

function createTitleComparer(order) {
  return (album1, album2) => {
    const comp = compareTitles(album1, album2) || compareDefault(album1, album2);
    return comp * order;
  };
}

function createDocCountComparer(order) {
  return (album1, album2) => {
    const comp = compareDocCount(album1, album2) || compareDefault(album1, album2);
    return comp * order;
  };
}

function compareTitles(album1, album2) {
  const title1 = album1.title.toUpperCase();
  const title2 = album2.title.toUpperCase();
  return compareValue(title1, title2);
}

function compareDocCount(album1, album2) {
  const count1 = album1.documents.length;
  const count2 = album2.documents.length;
  return compareValue(count1, count2);
}

function compareDefault(album1, album2) {
  return compareValue(album1._id, album2._id);
}

function compareValue(val1, val2) {
  if(val1 === val2) {
    return 0;
  }

  return val1 < val2 ? -1 : 1;
}
