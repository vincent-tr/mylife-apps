import 'source-map-support/register';

require('../src/init');
const { runServices, getArg } = require('mylife-tools-server');
import dataConfiguration from '../src/data-configuration';
require('../src/energy-collector');

const runCollector = !!getArg('collector');

const services = [];
const parameters = { dataConfiguration };

if(runCollector) {
  services.push('energy-collector');
}

runServices({ services, ... parameters });
