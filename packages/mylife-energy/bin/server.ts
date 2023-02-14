import 'source-map-support/register';

require('../src/init');
const { runServices, getArg } = require('mylife-tools-server');
import metadataDefintions from '../src/metadata';
const storeConfiguration = require('../src/store-configuration');
require('../src/energy-collector');

const runCollector = !!getArg('collector');

const services = [];
const parameters = { metadataDefintions, storeConfiguration };

if(runCollector) {
  services.push('energy-collector');
}

runServices({ services, ... parameters });
