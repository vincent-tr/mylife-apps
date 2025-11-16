export interface Entity {
  _id: string;
  _entity: string;
}

export type View<TEntity extends Entity> = {
  [id: string]: TEntity;
}


