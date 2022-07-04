import 'source-map-support/register';

require('../src/init');
require('../src/index-service');
const { runServices, getArg } = require('mylife-tools-server');
const { webApiFactory } = require('../src/web');
const { apiServices } = require('../src/api');
const metadataDefintions = require('../shared/metadata');
const storeConfiguration = require('../src/store-configuration');
require('../src/sync');

const runWeb = !!getArg('web');
const runSync = !!getArg('sync');

const services = ['store', 'database', 'index-service'];
const parameters = { webApiFactory, apiServices, metadataDefintions, storeConfiguration };

if(runWeb) {
  services.push('web-server', 'notification-service');
}

if(runSync) {
  services.push('sync-server');
}

runServices({ services, ... parameters });
