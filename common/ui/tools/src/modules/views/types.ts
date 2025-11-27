import * as api from '../../api';

export type View<TEntity extends api.Entity> = {
  [id: string]: TEntity;
};
