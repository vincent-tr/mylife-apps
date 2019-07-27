
'use strict';

const registry = require('./engine/registry');
const Datatype = require('./engine/datatype');
const Entity = require('./engine/entity');
const builtinDatatypes = require('./builtins/datatypes'):

exports.registerDatatype = registerDatatype;
exports.findDatatype = registry.findDatatype;
exports.getDatatype = registry.getDatatype;

exports.registerEntity = registerEntity;
exports.findEntity = registry.findEntity;
exports.getEntity = registry.getEntity;

for(const definition of builtinDatatypes) {
  registerDatatype(definition);
}

function registerDatatype(definition) {
  if(registry.findDatatype(definition.id)) {
    throw new Error(`Datatype already exists: '${definition.id}'`);
  }

  const datatype = new Datatype(definition);
  registry.registerDatatype(datatype);
};

function registerEntity(definition) {
  if(registry.findEntity(definition.id)) {
    throw new Error(`Entity already exists: '${definition.id}'`);
  }

  const entity = new Entity(definition);
  registry.registerEntity(entity);

  registerDatatypeReference(entity);
};

function registerDatatypeReference(entity) {
  // TODO
}
