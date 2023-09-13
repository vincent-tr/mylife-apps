import 'source-map-support/register';

require('../src/init');
const { runServices } = require('mylife-tools-server');
const { webApiFactory } = require('../src/web');
const { apiServices } = require('../src/api');

const services = ['web-server'];
const parameters = { webApiFactory, apiServices };

runServices({ services, ... parameters });
