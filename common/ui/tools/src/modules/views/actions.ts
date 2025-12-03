import { Action } from '@reduxjs/toolkit';
import { Mutex } from 'async-mutex';
import { STATE_PREFIX } from '../../constants/defines';
import { createToolsAsyncThunk } from '../../services/store-factory';
import * as io from '../io';
import { getViewId, getRefCount, setView, ref, unref } from './store';

interface CreateOrUpdateCriteriaView {
  service: string;
  method: string;
  criteria: unknown;
  viewIdSelector: (state) => string;
  setViewIdAction: (viewId: string) => Action;
  clearViewIdAction: () => Action;
}

export const createOrUpdateCriteriaView = createToolsAsyncThunk(
  `${STATE_PREFIX}/views/createOrUpdateCriteriaView`,
  async ({ service, method, criteria, viewIdSelector, setViewIdAction }: CreateOrUpdateCriteriaView, api) => {
    const state = api.getState();
    const viewId = viewIdSelector(state);

    if (viewId) {
      await api.extra.call({
        service: 'common',
        method: 'renotifyWithCriteria',
        viewId,
        criteria,
      });
    } else {
      const newViewId: string = await api.extra.call({
        service,
        method,
        criteria,
      });

      api.dispatch(setViewIdAction(newViewId));
    }
  }
);

interface DeleteCriteriaView {
  viewIdSelector: (state) => string;
  clearViewIdAction: () => Action;
}

export const deleteCriteriaView = createToolsAsyncThunk(`${STATE_PREFIX}/views/deleteCriteriaView`, async ({ viewIdSelector, clearViewIdAction }: DeleteCriteriaView, api) => {
  const state = api.getState();
  const oldViewId = viewIdSelector(state);
  if (!oldViewId) {
    return;
  }

  api.dispatch(clearViewIdAction());
  await api.dispatch(io.unnotify(oldViewId));
});

export interface SharedViewOptions {
  slot: string;
  service: string;
  method: string;
}

export const refSharedView = createToolsAsyncThunk(`${STATE_PREFIX}/views/refSharedView`, async ({ slot, service, method }: SharedViewOptions, api) => {
  const mutex = getSharedViewMutex(slot);

  await mutex.runExclusive(async () => {
    api.dispatch(ref(slot));

    const state = api.getState();
    const isAttach = getRefCount(state, slot) === 1;

    if (isAttach) {
      const viewId: string = await api.extra.call({ service, method });
      api.dispatch(setView({ slot, viewId }));
    }
  });
});

export const unrefSharedView = createToolsAsyncThunk(`${STATE_PREFIX}/views/unrefSharedView`, async (slot: string, api) => {
  const mutex = getSharedViewMutex(slot);

  await mutex.runExclusive(async () => {
    api.dispatch(unref(slot));

    const state = api.getState();
    const isDetach = getRefCount(state, slot) === 0;

    if (isDetach) {
      const viewId = getViewId(state, slot);
      if (viewId) {
        api.dispatch(setView({ slot, viewId: null }));
        await api.dispatch(io.unnotify(viewId));
      }
    }
  });
});

// Mutex per slot for shared view operations
const sharedViewMutexes = new Map<string, Mutex>();

function getSharedViewMutex(slot: string): Mutex {
  if (!sharedViewMutexes.has(slot)) {
    sharedViewMutexes.set(slot, new Mutex());
  }
  return sharedViewMutexes.get(slot)!;
}

export interface StaticViewOptions {
  slot: string;
  service: string;
  method: string;
}

export const createStaticView = createToolsAsyncThunk(`${STATE_PREFIX}/views/create`, async ({ service, method, slot }: StaticViewOptions, api) => {
  const viewId: string = await api.extra.call({
    service,
    method,
  });

  api.dispatch(setView({ slot, viewId }));
});
