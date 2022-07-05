'use strict';

const path          = require('path');
const fs            = require('fs');
const http          = require('http');
const express       = require('express');
const bodyParser    = require('body-parser');
const favicon       = require('serve-favicon');
const enableDestroy = require('server-destroy');
const { Server: IOServer }      = require('socket.io');

const { createLogger } = require('./logging');
const { getDefine } = require('./defines');
const { getConfig } = require('./config');
const { getArg } = require('./cli');
const { registerService, getService } = require('./service-manager');

const logger = createLogger('mylife:tools:server:web-server');

class WebServer {
  async init(options) {
    this._server = await setupServer(options);
  }

  async terminate() {
    logger.info('server close');
    await asyncCall(cb => this._server.destroy(cb));
  }
}

WebServer.serviceName = 'web-server';
WebServer.dependencies = ['io'];

registerService(WebServer);

async function setupServer({ config = getConfig('webServer'), webApiFactory }) {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: '100mb' }));

  const publicDirectory = path.resolve(getDefine('baseDirectory'), 'static');

  logger.info(`using public directoy : ${publicDirectory}`);

  app.use(favicon(path.resolve(publicDirectory, 'images/favicon.ico')));
  if(webApiFactory) {
    await webApiFactory({ app, express, asyncHandler, webApiHandler });
  }
  app.use(express.static(publicDirectory));

  app.use(historyApiFallback(publicDirectory));

  const server = http.createServer(app);
  enableDestroy(server);

  const ios = new IOServer(server);
  ios.on('connection', socket => getService('io').newSocket(socket));

  await asyncCall(cb => server.listen(config, cb));
  logger.info(`server created : ${JSON.stringify(config)}`);

  return server;
}

async function asyncCall(target) {
  return new Promise((resolve, reject) => target((err, res) => (err ? reject(err) : resolve(res))));
}

function historyApiFallback(publicDirectory) {
  const content = fs.readFileSync(path.join(publicDirectory, 'index.html'));
  return (req, res) => res.end(content);
}

function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch(err) {
      next(err);
    }
  };
}

function webApiHandler(handler) {
  return async (req, res) => {
    try {
      const result = await handler({ ... req.query, ... req.body });
      res.json(typeof result === 'undefined' ? {} : result);
    } catch(err) {
      logger.error(`Error while running api: ${err.stack}`);
      return res.status(500).json({ message: err.message, stack: err.stack });
    }
  };
}
