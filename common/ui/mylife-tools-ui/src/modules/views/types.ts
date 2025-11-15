export interface Entity {
  _id: string;
}

export type View<TEntity extends Entity> = {
  [id: string]: TEntity;
}


