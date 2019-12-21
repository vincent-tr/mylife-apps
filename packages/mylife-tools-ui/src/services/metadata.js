'use strict';

const { metadata } = require('mylife-tools-common');

export function initMetadata(metadataDefintions) {
  const { datatypes = [], entities = [] } = metadataDefintions;
  for(const datatype of datatypes) {
    metadata.registerDatatype(datatype);
  }
  for(const entity of entities) {
    metadata.registerEntity(entity);
  }
}
