import { Action } from '@reduxjs/toolkit';
import { Mutex } from 'async-mutex';
import { createToolsAsyncThunk, ToolsState, ToolsApi, STATE_PREFIX } from '../../services/store-api';
import * as io from '../io';
import { getViewId, getRefCount, setView, ref, unref } from './store';

export type CriteriaViewCreatorApi<Api extends ToolsApi, TCriteria> = (api: Api, criteria: TCriteria) => Promise<string>;

interface CreateOrUpdateCriteriaView<Api extends ToolsApi> {
  viewCreatorApi: CriteriaViewCreatorApi<Api, unknown>;
  criteria: unknown;
  viewIdSelector: (state: ToolsState) => string;
  setViewIdAction: (viewId: string) => Action;
  clearViewIdAction: () => Action;
}

export const createOrUpdateCriteriaView = createToolsAsyncThunk(
  `${STATE_PREFIX}/views/createOrUpdateCriteriaView`,
  async ({ viewCreatorApi, criteria, viewIdSelector, setViewIdAction }: CreateOrUpdateCriteriaView<ToolsApi>, api) => {
    const state = api.getState();
    const viewId = viewIdSelector(state);

    if (viewId) {
      await api.extra.common.renotifyWithCriteria(viewId, criteria);
    } else {
      const newViewId = await viewCreatorApi(api.extra, criteria);
      api.dispatch(setViewIdAction(newViewId));
    }
  }
);

interface DeleteCriteriaView {
  viewIdSelector: (state: ToolsState) => string;
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

export type ViewCreatorApi<Api extends ToolsApi> = (api: Api) => Promise<string>;

export interface SharedViewOptions<Api extends ToolsApi> {
  slot: string;
  viewCreatorApi: ViewCreatorApi<Api>;
}

export const refSharedView = createToolsAsyncThunk(`${STATE_PREFIX}/views/refSharedView`, async ({ slot, viewCreatorApi }: SharedViewOptions<ToolsApi>, api) => {
  const mutex = getSharedViewMutex(slot);

  await mutex.runExclusive(async () => {
    api.dispatch(ref(slot));

    const state = api.getState();
    const isAttach = getRefCount(state, slot) === 1;

    if (isAttach) {
      const viewId = await viewCreatorApi(api.extra);
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

export interface StaticViewOptions<Api extends ToolsApi> {
  slot: string;
  viewCreatorApi: ViewCreatorApi<Api>;
}

export const createStaticView = createToolsAsyncThunk(`${STATE_PREFIX}/views/create`, async ({ viewCreatorApi, slot }: StaticViewOptions<ToolsApi>, api) => {
  const viewId = await viewCreatorApi(api.extra);
  api.dispatch(setView({ slot, viewId }));
});
