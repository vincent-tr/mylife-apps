import Datatype from './engine/datatype';
import Entity from './engine/entity';
import * as registry from './engine/registry';
import * as builtins from './builtins';

for (const definition of builtins.datatypes) {
  registerDatatype(definition);
}

for (const definition of builtins.entities) {
  registerEntity(definition);
}

function registerDatatype(definition) {
  if (registry.findDatatype(definition.id)) {
    throw new Error(`Datatype already exists: '${definition.id}'`);
  }

  const datatype = new Datatype(definition);
  registry.registerDatatype(datatype);

  registry.registerDatatype(new Datatype({ id: `list:${datatype.id}`, list: datatype.id }));
  registry.registerDatatype(new Datatype({ id: `map:${datatype.id}`, map: datatype.id }));
}

function registerEntity(definition) {
  if (registry.findEntity(definition.id)) {
    throw new Error(`Entity already exists: '${definition.id}'`);
  }

  const entity = new Entity(definition);
  registry.registerEntity(entity);

  // register its reference type
  registerDatatype({ id: entity.id, reference: entity.id });
}

export function initMetadata(metadataDefintions) {
  const { datatypes = [], entities = [] } = metadataDefintions;
  for (const datatype of datatypes) {
    registerDatatype(datatype);
  }
  for (const entity of entities) {
    registerEntity(entity);
  }
}

export const getEntity = registry.getEntity;

export function getFieldName(entity, field) {
  return registry.getEntity(entity).getField(field).name;
}

export function getFieldDatatype(entity, field) {
  return registry.getEntity(entity).getField(field).datatype;
}

export function getStructureFieldName(datatype, field) {
  return datatype.getField(field).name;
}

export function renderObject(object) {
  const entity = registry.getEntity(object._entity);
  return entity.render(object);
}
