'use strict';

const { serialize, deserialize } = require('./engine');

require('./plugins');

exports.serialize = serialize;
exports.deserialize = deserialize;
