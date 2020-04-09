'use strict';

import { metadata } from 'mylife-tools-common';

export function getFieldName(entity, field) {
  return metadata.getEntity(entity).getField(field).name;
}

export function getFieldDatatype(entity, field) {
  return metadata.getEntity(entity).getField(field).datatype;
}

export function getStructureFieldName(datatype, field) {
  return datatype.getField(field).name;
}

export function renderObject(object) {
  const entity = metadata.getEntity(object._entity);
  return entity.render(object);
}
