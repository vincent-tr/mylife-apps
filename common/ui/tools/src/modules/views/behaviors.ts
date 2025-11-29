import { useSelector } from 'react-redux';
import { useLifecycle } from '../../components/behaviors/lifecycle';
import { ViewReference, SharedViewReference } from './actions';
import { getViewBySlot } from './store';

/**
 * Hook to manage a view lifecycle with automatic attach/detach.
 * Wraps the ViewReference class.
 *
 * @param viewRef - ViewReference instance
 * @returns The current view data from the store
 */
export function useView(viewRef: ViewReference) {
  const enter = async () => await viewRef.attach();
  const leave = async () => await viewRef.detach();
  useLifecycle(enter, leave);

  return useSelector((state) => getViewBySlot(state, viewRef.slot));
}

/**
 * Hook to manage a shared view with ref counting.
 * Wraps the SharedViewReference class.
 *
 * @param sharedViewRef - SharedViewReference instance
 * @returns The current view data from the store
 */
export function useSharedView(sharedViewRef: SharedViewReference) {
  const enter = () => sharedViewRef.ref();
  const leave = () => sharedViewRef.unref();
  useLifecycle(enter, leave);

  return useSelector((state) => getViewBySlot(state, sharedViewRef.slot));
}
