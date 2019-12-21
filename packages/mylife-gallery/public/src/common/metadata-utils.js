'use strict';

import { metadata } from 'mylife-tools-common';

export function getFieldName(entity, field) {
  return metadata.getEntity(entity).getField(field).name;
}
