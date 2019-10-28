'use strict';

const path          = require('path');
const fs            = require('fs');
const http          = require('http');
const express       = require('express'); // use from mylife-tools-server
const favicon       = require('serve-favicon'); // use from mylife-tools-server
const enableDestroy = require('server-destroy'); // use from mylife-tools-server
const Handlebars    = require('handlebars');

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
  const baseDirectory = getDefine('baseDirectory');
  const publicDirectory = path.resolve(baseDirectory, 'public');
  logger.info(`using public directoy : ${publicDirectory}`);

  app.use(favicon(path.resolve(publicDirectory, 'favicon.ico')));
  app.use('/dist/bootstrap', express.static(path.resolve(baseDirectory, 'node_modules/bootstrap/dist')));
  app.use('/dist/jquery', express.static(path.resolve(baseDirectory, 'node_modules/jquery/dist')));
  app.get('/', createIndexRenderer(path.resolve(publicDirectory, 'index.template')));

  app.get('/images/*', (req, res) => res.status(200).sendFile(path.resolve(publicDirectory, 'favicon.ico')));

  // TODO: images

  const server = http.createServer(app);
  enableDestroy(server);

  await asyncCall(cb => server.listen(config, cb));
  logger.info(`server created : ${JSON.stringify(config)}`);

  return server;
}

async function asyncCall(target) {
  return new Promise((resolve, reject) => target((err, res) => (err ? reject(err) : resolve(res))));
}

function createIndexRenderer(templateFile) {
  const template = Handlebars.compile(fs.readFileSync(templateFile, 'utf-8'));

  // TODO
  const context = { body: 'Hello!' };
  const content = template(context);

  return (req, res) => {
    res.status(200)
       .set('Content-Type', 'text/html')
       .send(content)
       .end();
  };
}
