import 'source-map-support/register';

require('../src/init');
const { runServices, getArg } = require('mylife-tools-server');
require('../src/energy-collector');

const runCollector = !!getArg('collector');

const services = [];

if(runCollector) {
  services.push('energy-collector');
}

runServices({ services });
