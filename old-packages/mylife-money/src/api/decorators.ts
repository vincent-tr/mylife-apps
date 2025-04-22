'use strict';

const { api, createDecoratorGroup } = require('mylife-tools-server');

exports.base = createDecoratorGroup(/*api.decorators.methodLogger*/);
