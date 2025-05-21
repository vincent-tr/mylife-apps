import path from 'path';
import fs from 'fs';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import enableDestroy from 'server-destroy';
import { Server as IOServer } from 'socket.io';

import { createLogger } from './logging';
import { getDefine } from './defines';
import { getConfig } from './config';
import { registerService, getService } from './service-manager';

const logger = createLogger('mylife:tools:server:web-server');

class WebServer {
  private server;

  async init(options) {
    this.server = await setupServer(options);
  }

  async terminate() {
    logger.info('server close');
    await asyncCall((cb) => this.server.destroy(cb));
  }

  static readonly serviceName = 'web-server';
  static readonly dependencies = ['io'];
}

registerService(WebServer);

async function setupServer({ config = getConfig('webServer'), webApiFactory }) {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: '100mb' }));

  const publicDirectory = path.resolve(getDefine('baseDirectory'), 'static');
  const hasPublicDirectory = fs.existsSync(publicDirectory);

  if (hasPublicDirectory) {
    logger.info(`using public directoy : ${publicDirectory}`);
  } else {
    logger.warn(`Public directory '${publicDirectory}' does not exist, static content not served`);
  }

  if (hasPublicDirectory) {
    app.use(favicon(path.join(publicDirectory, 'favicon.ico')));
  }

  if (webApiFactory) {
    await webApiFactory({ app, express, asyncHandler, webApiHandler });
  }

  if (hasPublicDirectory) {
    app.use(express.static(publicDirectory));
    app.use(historyApiFallback(publicDirectory));
  }

  const server = http.createServer(app);
  enableDestroy(server);

  const ios = new IOServer(server);
  ios.on('connection', (socket) => getService('io').newSocket(socket));

  await asyncCall((cb) => server.listen(config, cb));
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
    } catch (err) {
      next(err);
    }
  };
}

function webApiHandler(handler) {
  return async (req, res) => {
    try {
      const result = await handler({ ...req.query, ...req.body });
      res.json(typeof result === 'undefined' ? {} : result);
    } catch (err) {
      logger.error(`Error while running api: ${err.stack}`);
      return res.status(500).json({ message: err.message, stack: err.stack });
    }
  };
}
