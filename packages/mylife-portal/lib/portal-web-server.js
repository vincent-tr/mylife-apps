'use strict';

const path          = require('path');
const fs            = require('fs');
const http          = require('http');
const express       = require('express'); // use from mylife-tools-server
const favicon       = require('serve-favicon'); // use from mylife-tools-server
const enableDestroy = require('server-destroy'); // use from mylife-tools-server

const { createLogger, getDefine, getConfig, registerService, getService } = require('mylife-tools-server');

const logger = createLogger('mylife:portal:portal-web-server');

class PortalWebServer {
  async init(options) {
    this._server = await setupServer(options);
  }

  async terminate() {
    logger.info('server close');
    await asyncCall(cb => this._server.destroy(cb));
  }
}

PortalWebServer.serviceName = 'portal-web-server';
PortalWebServer.dependencies = ['store'];

registerService(PortalWebServer);

async function setupServer({ config = getConfig('webServer') }) {
  const app = express();

  const publicDirectory = path.resolve(getDefine('baseDirectory'), 'public');

  logger.info(`using public directoy : ${publicDirectory}`);

  app.use(favicon(path.resolve(publicDirectory, 'images/favicon.svg')));
  app.use(express.static(publicDirectory));

  const indexReference = { content: null };
  loadDefaultIndex(publicDirectory, indexReference);
  app.use(historyApiFallback(indexReference));

  const server = http.createServer(app);
  enableDestroy(server);

  await asyncCall(cb => server.listen(config, cb));
  logger.info(`server created : ${JSON.stringify(config)}`);

  return server;
}

async function asyncCall(target) {
  return new Promise((resolve, reject) => target((err, res) => (err ? reject(err) : resolve(res))));
}

function loadDefaultIndex(publicDirectory, indexReference) {
  indexReference.content = fs.readFileSync(path.join(publicDirectory, 'index.html'));
}

function historyApiFallback(indexReference) {
  return (req, res) => res.end(indexReference.content);
}
