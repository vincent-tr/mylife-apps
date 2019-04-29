'use strict';

export const createValueToEditor = caster => (nullable, value) => {
  if(!nullable && value === null) {
    throw new Error('Field is not nullable but value is null');
  }

  return value === null ? '' : caster(value);
};

export const createEditorToValue = (parser, defaultValue) => (nullable, value) => {
  if(value === '') {
    return nullable ? null : defaultValue;
  }

  return parser(value);
};
