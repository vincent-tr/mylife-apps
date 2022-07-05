import 'source-map-support/register';

require('../src/init');
require('../src/nagios-service');
const { runServices } = require('mylife-tools-server');
const { apiServices } = require('../src/api');
const metadataDefintions = require('../shared/metadata');

const services = ['nagios-service', 'web-server', 'notification-service'];
const parameters = { apiServices, metadataDefintions };
runServices({ services, ... parameters });
