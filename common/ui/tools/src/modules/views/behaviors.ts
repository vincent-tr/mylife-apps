import { useSelector } from 'react-redux';
import { api } from '../..';
import { useLifecycle } from '../../components/behaviors/lifecycle';
import { getStore } from '../../services';
import { SharedViewReference, StaticViewOptions, createStaticView } from './actions';
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

// Global map to store SharedViewReference instances by slot
const sharedViewRefs = new Map<string, SharedViewReference>();

function validateSharedViewOptions(slot: string, existingRef: SharedViewReference, newOptions: SharedViewOptions): void {
  if (existingRef.service !== newOptions.service || existingRef.method !== newOptions.method) {
    console.error(
      `useSharedView called with different options for slot "${slot}".`,
      '\nExisting:',
      {
        service: existingRef.service,
        method: existingRef.method,
        //canUpdate: existingRef.canUpdate,
        //criteriaSelector: existingRef.criteriaSelector,
      },
      '\nNew:',
      newOptions
    );
  }
}

function getOrCreateSharedViewRef(options: SharedViewOptions): SharedViewReference {
  const { slot } = options;

  if (!sharedViewRefs.has(slot)) {
    sharedViewRefs.set(slot, new SharedViewReference(options));
  } else {
    validateSharedViewOptions(slot, sharedViewRefs.get(slot)!, options);
  }

  return sharedViewRefs.get(slot)!;
}

/**
 * Hook to manage a shared view with ref counting.
 * Creates or reuses a SharedViewReference instance based on the slot.
 *
 * @param options - SharedViewReference constructor options
 * @returns The current view data from the store
 */
export function useSharedView<TEntity extends api.Entity>(options: SharedViewOptions) {
  const sharedViewRef = getOrCreateSharedViewRef(options);

  const enter = () => sharedViewRef.ref();
  const leave = () => sharedViewRef.unref();
  useLifecycle(enter, leave);

  return useSelector((state) => getViewBySlot<TEntity>(state, options.slot));
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
