import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../..';
import { useLifecycle } from '../../components/behaviors/lifecycle';
import { getStore } from '../../services';
import { StaticViewOptions, createStaticView, refSharedView, unrefSharedView } from './actions';
import { getViewBySlot } from './store';
import { View } from './types';

interface ViewOptions {
  criteriaSelector;
  service: string;
  method: string;
  canUpdate?: boolean;
}

/**
 * Hook to manage a view lifecycle with automatic attach/detach.
 * Creates or reuses a ViewReference instance based on the slot.
 *
 * @param options - ViewReference constructor options
 * @returns The current view data from the store
 */
export function useView<TEntity extends api.Entity>(options: ViewOptions): View<TEntity> {
  void options;
  throw new Error('Not implemented');

  // const enter = async () => await viewRef.attach();
  // const leave = async () => await viewRef.detach();
  // useLifecycle(enter, leave);

  // return useSelector((state) => getViewBySlot<TEntity>(state, options.slot));
}

interface SharedViewOptions {
  slot: string;
  service: string;
  method: string;
}

/**
 * Hook to manage a shared view with ref counting.
 * Multiple components can use the same shared view simultaneously.
 * The view is created when the first component mounts and destroyed when the last one unmounts.
 *
 * @param options - Shared view options (slot, service, method), must be stable (constants)
 * @returns The current view data from the store
 */
export function useSharedView<TEntity extends api.Entity>(options: SharedViewOptions) {
  const { dispatch } = getStore();
  const { slot, service, method } = options;

  const enter = useCallback(() => dispatch(refSharedView({ slot, service, method })), [dispatch, slot, service, method]);
  const leave = useCallback(() => dispatch(unrefSharedView(slot)), [dispatch, slot]);
  useLifecycle(enter, leave);

  return useSelector((state) => getViewBySlot<TEntity>(state, slot));
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
