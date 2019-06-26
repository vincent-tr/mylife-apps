'use strict';

const { decorators, createDecoratorGroup } = require('mylife-tools-server');

exports.base = createDecoratorGroup(decorators.methodLogger);
