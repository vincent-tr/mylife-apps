import { api, views } from 'mylife-tools';
import { AppApi } from './store-api';

export function useCriteriaView<TEntity extends api.Entity, TCriteria>(options: views.CriteriaViewOptions<TCriteria, AppApi>) {
  return views.useCriteriaView<AppApi, TEntity, TCriteria>(options);
}

export function useSharedView<TEntity extends api.Entity>(options: views.SharedViewOptions<AppApi>) {
  return views.useSharedView<AppApi, TEntity>(options);
}

export function initStaticView(options: views.StaticViewOptions<AppApi>) {
  views.initStaticView(options);
}
