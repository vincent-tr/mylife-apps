'use strict';

module.exports = {
  id: 'base',
  fields: [
    { id: '_id', datatype: 'identifier', constraints: ['hidden', 'readonly', 'not-null'] }
  ]
};
