'use strict';

exports.datatypes = require('./datatypes');
exports.entities = [
  require('./entities/document'),
  require('./entities/image'),
  require('./entities/video'),
  require('./entities/other'),
  require('./entities/album'),
  require('./entities/person'),
];
