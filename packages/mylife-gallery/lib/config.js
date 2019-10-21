'use strict';

const readConfig = require('read-config');
const config = readConfig(require.resolve('../conf/config'));

module.exports = config;
