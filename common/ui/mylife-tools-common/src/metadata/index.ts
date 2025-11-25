import Datatype from './engine/datatype';
import Entity from './engine/entity';
import * as registry from './engine/registry';
import * as builtins from './builtins';

export const findDatatype = registry.findDatatype;
export const getDatatype = registry.getDatatype;
export const findEntity = registry.findEntity;
export const getEntity = registry.getEntity;

for (const definition of builtins.datatypes) {
  registerDatatype(definition);
}

for (const definition of builtins.entities) {
  registerEntity(definition);
}

export function registerDatatype(definition) {
  if (registry.findDatatype(definition.id)) {
    throw new Error(`Datatype already exists: '${definition.id}'`);
  }

  const datatype = new Datatype(definition);
  registry.registerDatatype(datatype);

  registry.registerDatatype(new Datatype({ id: `list:${datatype.id}`, list: datatype.id }));
  registry.registerDatatype(new Datatype({ id: `map:${datatype.id}`, map: datatype.id }));
}

export function registerEntity(definition) {
  if (registry.findEntity(definition.id)) {
    throw new Error(`Entity already exists: '${definition.id}'`);
  }

  const entity = new Entity(definition);
  registry.registerEntity(entity);

  // register its reference type
  registerDatatype({ id: entity.id, reference: entity.id });
}
