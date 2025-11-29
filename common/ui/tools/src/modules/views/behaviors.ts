import { useSelector } from 'react-redux';
import { useLifecycle } from '../../components/behaviors/lifecycle';
import { ViewReference, SharedViewReference } from './actions';
import { getViewBySlot } from './store';

interface ViewOptions {
  slot: string;
  criteriaSelector?;
  service: string;
  method: string;
  canUpdate?: boolean;
}

// Global map to store ViewReference instances by slot
const viewRefs = new Map<string, ViewReference>();

function validateViewOptions(slot: string, existingRef: ViewReference, newOptions: ViewOptions): void {
  if (
    existingRef.service !== newOptions.service ||
    existingRef.method !== newOptions.method ||
    existingRef.canUpdate !== newOptions.canUpdate ||
    existingRef.criteriaSelector !== newOptions.criteriaSelector
  ) {
    console.error(
      `useView called with different options for slot "${slot}".`,
      '\nExisting:',
      {
        service: existingRef.service,
        method: existingRef.method,
        canUpdate: existingRef.canUpdate,
        criteriaSelector: existingRef.criteriaSelector,
      },
      '\nNew:',
      newOptions
    );
  }
}

function getOrCreateViewRef(options: ViewOptions): ViewReference {
  const { slot } = options;

  if (!viewRefs.has(slot)) {
    viewRefs.set(slot, new ViewReference(options));
  } else {
    validateViewOptions(slot, viewRefs.get(slot)!, options);
  }

  return viewRefs.get(slot)!;
}

/**
 * Hook to manage a view lifecycle with automatic attach/detach.
 * Creates or reuses a ViewReference instance based on the slot.
 *
 * @param options - ViewReference constructor options
 * @returns The current view data from the store
 */
export function useView(options: ViewOptions) {
  const viewRef = getOrCreateViewRef(options);

  const enter = async () => await viewRef.attach();
  const leave = async () => await viewRef.detach();
  useLifecycle(enter, leave);

  return useSelector((state) => getViewBySlot(state, options.slot));
}

interface SharedViewOptions {
  slot: string;
  criteriaSelector?;
  service: string;
  method: string;
  canUpdate?: boolean;
}

// Global map to store SharedViewReference instances by slot
const sharedViewRefs = new Map<string, SharedViewReference>();

function validateSharedViewOptions(slot: string, existingRef: SharedViewReference, newOptions: SharedViewOptions): void {
  if (
    existingRef.service !== newOptions.service ||
    existingRef.method !== newOptions.method ||
    existingRef.canUpdate !== newOptions.canUpdate ||
    existingRef.criteriaSelector !== newOptions.criteriaSelector
  ) {
    console.error(
      `useSharedView called with different options for slot "${slot}".`,
      '\nExisting:',
      {
        service: existingRef.service,
        method: existingRef.method,
        canUpdate: existingRef.canUpdate,
        criteriaSelector: existingRef.criteriaSelector,
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
export function useSharedView(options: SharedViewOptions) {
  const sharedViewRef = getOrCreateSharedViewRef(options);

  const enter = () => sharedViewRef.ref();
  const leave = () => sharedViewRef.unref();
  useLifecycle(enter, leave);

  return useSelector((state) => getViewBySlot(state, options.slot));
}
