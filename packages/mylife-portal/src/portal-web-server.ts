import path from 'path';
import fs from 'fs';
import http from 'http';
import express from 'express'; // use from mylife-tools-server
import favicon from 'serve-favicon'; // use from mylife-tools-server
import enableDestroy from 'server-destroy'; // use from mylife-tools-server
import Handlebars from 'handlebars';

const { createLogger, getDefine, getConfig, registerService, getStoreCollection } = require('mylife-tools-server');

const logger = createLogger('mylife:portal:portal-web-server');

class PortalWebServer {
  private server;

  async init(options) {
    this.server = await setupServer(options);
  }

  async terminate() {
    logger.info('server close');
    await asyncCall((cb) => this.server.destroy(cb));
  }

  static readonly serviceName = 'portal-web-server';
  static readonly dependencies = ['store'];
}

registerService(PortalWebServer);

async function setupServer({ config = getConfig('webServer') }) {
  const app = express();
  const baseDirectory = getDefine('baseDirectory');
  const publicDirectory = path.resolve(baseDirectory, 'static');
  logger.info(`using public directoy : ${publicDirectory}`);

  app.use(favicon(path.resolve(publicDirectory, 'favicon.ico')));
  app.get('/', createIndexRenderer(path.resolve(publicDirectory, 'index.template')));
  app.get('/images/:code', createImagesRenderer());
  app.use(express.static(publicDirectory));

  const server = http.createServer(app);
  enableDestroy(server);

  await asyncCall((cb) => server.listen(config, cb));
  logger.info(`server created : ${JSON.stringify(config)}`);

  return server;
}

async function asyncCall(target) {
  return new Promise((resolve, reject) => target((err, res) => (err ? reject(err) : resolve(res))));
}

function createIndexRenderer(templateFile) {
  const template = Handlebars.compile(fs.readFileSync(templateFile, 'utf-8'));
  let content;

  const update = () => {
    logger.info('rebuilding index');
    const context = buildContext();
    content = template(context);
  };

  update();

  const sections = getStoreCollection('sections');
  const items = getStoreCollection('items');
  sections.on('change', update);
  items.on('change', update);

  return (req, res) => {
    res.status(200).set('Content-Type', 'text/html').send(content).end();
  };
}

function buildContext() {
  const sections = getStoreCollection('sections')
    .list()
    .sort((s1, s2) => s1.order - s2.order);
  const items = getStoreCollection('items').list();

  return {
    sections: sections.map((section) => ({
      display: section.display,
      items: section.items
        .map((code) => {
          const item = items.find((item) => item.code === code);
          if (!item) {
            return;
          }

          return {
            code: item.code,
            display: item.display,
            target: item.target,
          };
        })
        .filter((x) => x),
    })),
  };
}

function createImagesRenderer() {
  let images = {};
  const update = () => {
    const items = getStoreCollection('items').list();
    images = {};
    for (const { code, icon, iconMime } of items) {
      if (!icon || !iconMime) {
        continue;
      }

      images[code] = { buffer: icon, mime: iconMime };
    }
  };

  update();

  const items = getStoreCollection('items');
  items.on('change', update);

  return (req, res) => {
    const { code } = req.params;
    const image = images[code];
    if (!image) {
      logger.debug(`image not found for code '${code}'`);
      return res.status(404).end();
    }

    res.status(200).set('Content-Type', image.mime).send(image.buffer).end();
  };
}
