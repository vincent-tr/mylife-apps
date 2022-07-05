const datatypes = new Map();
const entities = new Map();

export function registerDatatype(datatype) {
  datatypes.set(datatype.id, datatype);
}

export function findDatatype(id) {
  return datatypes.get(id);
}

export function getDatatype(id) {
  const datatype = datatypes.get(id);
  if(datatype) {
    return datatype;
  }

  throw new Error(`Datatype not found: '${id}'`);
}

export function registerEntity(entity) {
  entities.set(entity.id, entity);
}

export function findEntity(id) {
  return entities.get(id);
}

export function getEntity(id) {
  const entity = entities.get(id);
  if(entity) {
    return entity;
  }

  throw new Error(`Entity not found: '${id}'`);
}
