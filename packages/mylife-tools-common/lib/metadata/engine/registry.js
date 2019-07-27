
'use strict';

const datatypes = new Map();
const entities = new Map();

exports.registerDatatype = datatype => datatypes.set(datatype.id, datatype);

exports.findDatatype = id => datatypes.get(id);

exports.getDatatype = id => {
  const datatype = datatypes.get(id);
  if(datatype) {
    return datatype;
  }

  throw new Error(`Datatype not found: '${id}'`);
};

exports.registerEntity = entity => entities.set(entity.id, entity);

exports.findEntity = id => entities.get(id);

exports.getEntity = id => {
  const entity = entities.get(id);
  if(entity) {
    return entity;
  }

  throw new Error(`Entity not found: '${id}'`);
};
