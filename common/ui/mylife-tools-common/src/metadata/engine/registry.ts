import Datatype from './datatype';
import Entity from './entity';

const datatypes = new Map<string, Datatype>();
const entities = new Map<string, Entity>();

export function registerDatatype(datatype: Datatype) {
  datatypes.set(datatype.id, datatype);
}

export function findDatatype(id: string) {
  return datatypes.get(id);
}

export function getDatatype(id: string) {
  const datatype = datatypes.get(id);
  if (datatype) {
    return datatype;
  }

  throw new Error(`Datatype not found: '${id}'`);
}

export function registerEntity(entity: Entity) {
  entities.set(entity.id, entity);
}

export function findEntity(id: string) {
  return entities.get(id);
}

export function getEntity(id: string) {
  const entity = entities.get(id);
  if (entity) {
    return entity;
  }

  throw new Error(`Entity not found: '${id}'`);
}
