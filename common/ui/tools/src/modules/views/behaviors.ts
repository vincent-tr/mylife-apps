import { Action } from '@reduxjs/toolkit/react';
import { useCallback } from 'react';
import { api } from '../..';
import { useLifecycle } from '../../components/behaviors/lifecycle';
import { useToolsDispatch, useToolsSelector } from '../../services/store-api';
import { getStore } from '../../services/store-factory';
import { SharedViewOptions, StaticViewOptions, createOrUpdateCriteriaView, createStaticView, deleteCriteriaView, refSharedView, unrefSharedView } from './actions';
import { getViewBySlot } from './store';
import { View } from './types';

export interface CriteriaViewOptions<TCriteria> {
  service: string;
  method: string;
  criteria: TCriteria;

  setViewIdAction: (viewId: string) => Action;
  clearViewIdAction: () => Action;
  viewIdSelector: (state) => string;
}

/**
 * Hook to manage a view lifecycle with automatic attach/detach.
 * Creates or reuses a ViewReference instance based on the slot.
 *
 * @param options - ViewReference constructor options
 * @returns The current view data from the store
 */
export function useCriteriaView<TEntity extends api.Entity, TCriteria>(options: CriteriaViewOptions<TCriteria>): View<TEntity> {
  const dispatch = useToolsDispatch();
  const { service, method, criteria, setViewIdAction, clearViewIdAction, viewIdSelector } = options;

  const enterOrUpdate = useCallback(() => {
    dispatch(
      createOrUpdateCriteriaView({
        service,
        method,
        criteria,
        viewIdSelector,
        setViewIdAction,
        clearViewIdAction,
      })
    );
  }, [dispatch, service, method, criteria, viewIdSelector, setViewIdAction, clearViewIdAction]);

  const leave = useCallback(() => {
    dispatch(
      deleteCriteriaView({
        viewIdSelector,
        clearViewIdAction,
      })
    );
  }, [dispatch, viewIdSelector, clearViewIdAction]);

  useLifecycle(enterOrUpdate, leave, [criteria]);

  const viewId = useToolsSelector(viewIdSelector);
  return useToolsSelector((state) => getViewBySlot<TEntity>(state, viewId));
}

export type { SharedViewOptions };

/**
 * Hook to manage a shared view with ref counting.
 * Multiple components can use the same shared view simultaneously.
 * The view is created when the first component mounts and destroyed when the last one unmounts.
 *
 * @param options - Shared view options (slot, service, method), must be stable (constants)
 * @returns The current view data from the store
 */
export function useSharedView<TEntity extends api.Entity>(options: SharedViewOptions) {
  const dispatch = useToolsDispatch();
  const { slot, service, method } = options;

  const enter = useCallback(() => dispatch(refSharedView({ slot, service, method })), [dispatch, slot, service, method]);
  const leave = useCallback(() => dispatch(unrefSharedView(slot)), [dispatch, slot]);
  useLifecycle(enter, leave);

  return useToolsSelector((state) => getViewBySlot<TEntity>(state, slot));
}

export type { StaticViewOptions };

/**
 * Initialize a static view that is fetched once at startup and never released.
 *
 * This should be called during application initialization, before rendering. This is not a hook.
 *
 * @param options - View initialization options
 */
export function initStaticView(options: StaticViewOptions) {
  const { dispatch } = getStore();
  dispatch(createStaticView(options));
}
