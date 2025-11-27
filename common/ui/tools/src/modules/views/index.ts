import * as api from '../../api';
import { View } from './types';
export { getView } from './store';
export { ViewReference, SharedViewReference, createOrUpdateView, deleteView } from './actions';
export { useSharedView, createViewSelector } from './behaviors';

export type { View };

export function filter<TEntity extends api.Entity>(view: View<TEntity>, predicate: (item: TEntity) => boolean): View<TEntity> {
  const filteredView: View<TEntity> = {};

  for (const [id, item] of Object.entries(view)) {
    if (predicate(item)) {
      filteredView[id] = item;
    }
  }

  return filteredView;
}
