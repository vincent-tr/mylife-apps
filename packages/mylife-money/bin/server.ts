import 'source-map-support/register';

require('../src/init');
const { runServices } = require('mylife-tools-server');
const { apiServices } = require('../src/api');
const metadataDefintions = require('../shared/metadata');
const storeConfiguration = require('../src/store-configuration');
require('../src/bots');

const services = ['web-server', 'bot-service', 'store', 'notification-service'];
const parameters = { apiServices, metadataDefintions, storeConfiguration };
runServices({ services, ... parameters });
