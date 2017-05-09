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

  router.route('/stock').put(function(request, response) {
    const item = request.body;
    stockAdd(item, (err) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }
      logger.info(`stock created: ${JSON.stringify(item)}`);
      response.json({});
    });
  });
};

function stockAdd(item, done) {
  co(function*() {
    item.article = new ObjectID(item.article);
    item.bottleCapacity = new ObjectID(item.bottleCapacity);

    const { article, bottleCount, bottleCapacity, year } = item;

    const stock = coMonk(db.get('stock'));
    const history = coMonk(db.get('history'));

    yield stock.update({
      article, year, bottleCapacity
    }, {
      $setOnInsert: { article, year, bottleCapacity },
      $inc: { bottleCount },
    }, {
      upsert: true
    });

    yield history.insert(Object.assign({}, item, { isAdd: 1 }));

  }).then(() => done(), (err) => done(err));
}