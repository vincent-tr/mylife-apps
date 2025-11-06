import immutable from 'immutable';

export * from './actions';
export * from './selectors';
export * from './behaviors';
export { default as actionTypes } from './action-types';

export type View<TEntity> = immutable.Map<string, TEntity>