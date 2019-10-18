'use strict';

//const { ObjectID } = require('mongodb');
const monk         = require('monk');
const coMonk       = require('co-monk');
const co           = require('co');
const log4js       = require('log4js');
const logger       = log4js.getLogger('mylife:wine:crud');

// ex:
// create(config, router, 'capacity', 'capacities', (id) => [{ store: 'article', find: { capacity: id }}]);

module.exports.create = (config, router, routerName, storeName, constraintChecker = () => [], itemFormatter = item => item) => {

  const db = monk(config.mongo);

  router.route(`/${routerName}`).get(function(request, response) {
    getItems((err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }
      response.json(res);
    });
  });

  router.route(`/${routerName}`).put(function(request, response) {
    const item = request.body;
    createItem(item, (err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }
      logger.info(`${routerName} created: ${JSON.stringify(res)}`);
      response.json(res);
    });
  });

  router.route(`/${routerName}`).post(function(request, response) {
    const item = request.body;
    updateItem(item, (err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }
      logger.info(`${routerName} updated: ${JSON.stringify(res)}`);
      response.json(res);
    });
  });

  router.route(`/${routerName}`).delete(function(request, response) {
    const { id } = request.body;
    deleteItem(id, (err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }
      logger.info(`${routerName} deleted: ${id}`);
      response.json(res);
    });
  });

  function getItems(done) {
    co(function*() {
      const store = coMonk(db.get(storeName));
      return yield store.find({});
    }).then((value) => done(null, value), (err) => done(err));
  }

  function createItem(item, done) {
    co(function*() {
      item = itemFormatter(item);
      const store = coMonk(db.get(storeName));
      return yield store.insert(item);
    }).then((value) => done(null, value), (err) => done(err));
  }

  function updateItem(item, done) {
    item._id = item.id;
    delete item.id;
    co(function*() {
      item = itemFormatter(item);
      const store = coMonk(db.get(storeName));
      yield store.update({ _id: item._id }, item);
      return item;
    }).then((value) => done(null, value), (err) => done(err));
  }

  function deleteItem(id, done) {
    co(function*() {
      for(const check of constraintChecker(id)) {
        const checkStore = coMonk(db.get(check.store));
        const ref = yield checkStore.findOne(check.find);
        if(ref) { throw new Error(`Cannot delete ${routerName} '${id}' because it is used`); }
      }

      const store = coMonk(db.get(storeName));
      return yield store.remove({ _id: id });
    }).then((value) => done(null, value), (err) => done(err));
  }
};
