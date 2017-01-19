'use strict';

const path          = require('path');
const http          = require('http');
const express       = require('express');
const enableDestroy = require('server-destroy');
const bodyParser    = require('body-parser');
const favicon       = require('serve-favicon');
const serveStatic   = require('serve-static');

module.exports = class {

  constructor(config) {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '100mb' }));

    const publicDirectory = path.resolve(path.join(__dirname, '../public'));

    app.use(favicon(path.join(publicDirectory, 'images/favicon.ico')));
    app.use('/api', createApi());
    app.use(serveStatic(publicDirectory));

    this._server = http.Server(app);
    enableDestroy(this._server);

    this._server.listen(config.port);
  }

  close(done) {
    this._server.close(done);
    this._server.destroy();
  }
};

function createApi() {
  const router = express.Router();
/*
  router.route('/:entityId').post(function(request, response) {
    const entityId = request.params.entityId;
    const req = request.body;
    netResources.execute(req, (err, res) => {
      if(err) { return response.status(500).json(err); }
      response.json(res);
    }, entityId);
  });
*/
  return router;
}