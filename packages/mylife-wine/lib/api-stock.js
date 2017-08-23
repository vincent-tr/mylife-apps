'use strict';

const { ObjectID } = require('mongodb');
const monk         = require('monk');
const config       = require('../conf/config');
const coMonk       = require('co-monk');
const co           = require('co');
const log4js       = require('log4js');
const logger       = log4js.getLogger('mylife:wine:crud');

const db = monk(config.mongo);

module.exports.create = (router) => {

  router.route('/stock').get(function(request, response) {
    getStock((err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }
      response.json(res);
    });
  });

  router.route('/stock').put(function(request, response) {
    const item = request.body;
    addStock(item, (err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }
      logger.info(`stock created: ${JSON.stringify(res)}`);
      response.json(res);
    });
  });

  router.route('/stock').delete(function(request, response) {
    const item = request.body;
    removeStock(item, (err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }
      logger.info(`stock removed: ${JSON.stringify(res)}`);
      response.json(res);
    });
  });
};

function getStock(done) {
  co(function*() {
    const stock = coMonk(db.get('stock'));
    const history = coMonk(db.get('history'));

    return {
      stock: yield stock.find({}),
      history: yield history.find({})
    };

  }).then((value) => done(null, value), (err) => done(err));
}

function addStock(item, done) {
  co(function*() {
    item.article = new ObjectID(item.article);
    item.bottleCapacity = new ObjectID(item.bottleCapacity);

    const { article, bottleCount, bottleCapacity, year } = item;

    const stockCollection = coMonk(db.get('stock'));
    const historyCollection = coMonk(db.get('history'));

    const stock = yield stockCollection.findOneAndUpdate({
      article, year, bottleCapacity
    }, {
      $setOnInsert: { article, year, bottleCapacity },
      $inc: { bottleCount },
    }, {
      upsert: true,
      returnNewDocument: true
    });

    const history = Object.assign({}, item, { isAdd: 1 });
    yield historyCollection.insert(history);

    return { history, stock };

  }).then((value) => done(null, value), (err) => done(err));
}

function removeStock(item, done) {
  co(function*() {
    const { stock: stockId, bottleCount, date, note } = item;

    const stockCollection = coMonk(db.get('stock'));
    const historyCollection = coMonk(db.get('history'));

    const stock = yield stockCollection.findOneAndUpdate({
      _id: stockId
    }, {
      $inc: { bottleCount: -bottleCount },
    }, {
      returnNewDocument: true
    });

    if(stock.bottleCount <= 0) {
      yield stockCollection.remove({ _id: stockId }, { single: true });
      stock.delete = true;
    }

    const history = {
      year           : stock.year,
      bottleCount,
      date,
      isAdd          : 0,
      bottlePrice    : stock.bottlePrice,
      note,
      bottleCapacity : new ObjectID(stock.bottleCapacity),
      article        : new ObjectID(stock.article)
    };

    yield historyCollection.insert(history);

    return { history, stock };
  }).then((value) => done(null, value), (err) => done(err));
}
