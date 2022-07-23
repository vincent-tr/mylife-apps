'use strict';

exports.datatypes = require('./datatypes');
exports.entities = [
  require('./entities/document'),
  require('./entities/document-with-info'),
  require('./entities/image'),
  require('./entities/video'),
  require('./entities/other'),
  require('./entities/album'),
  require('./entities/person'),
  require('./entities/slideshow'),
  require('./entities/slideshow-image'),
  require('./entities/stat'),
  require('./entities/suggestion'),
];
