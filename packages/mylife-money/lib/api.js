'use strict';

const monk    = require('monk');
const config  = require('../conf/config');
const coMonk  = require('co-monk');
const co      = require('co');
const log4js  = require('log4js');
const logger  = log4js.getLogger('mylife:money:api');
const express = require('express');

module.exports = () => {
  const router = express.Router();

  router.route('/accounts').get(function(request, response) {
    getAccounts((err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err);
      }
      response.json(res);
    });
  });

  router.route('/groups').get(function(request, response) {
    getGroups((err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err);
      }
      response.json(res);
    });
  });

  router.route('/group').put(function(request, response) {
    const group = request.body;
    createGroup(group, (err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err);
      }
      logger.info(`group created: ${JSON.stringify(res)}`);
      response.json(res);
    });
  });

  router.route('/operations').get(function(request, response) {
    const { minDate, maxDate, accountId } = request.params;
    getOperations(minDate, maxDate, accountId, (err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err);
      }
      response.json(res);
    });
  });

  return router;
};

function getAccounts(done) {
  co(function*() {
    const db       = monk(config.mongo);
    const accounts = coMonk(db.get('accounts'));
    return yield accounts.find({});
  }).then((value) => done(null, value), (err) => done(err));
}

function getGroups(done) {
  co(function*() {
    const db     = monk(config.mongo);
    const groups = coMonk(db.get('groups'));
    return yield groups.find({});
  }).then((value) => done(null, value), (err) => done(err));
}

function createGroup(group, done) {
  co(function*() {
    const db     = monk(config.mongo);
    const groups = coMonk(db.get('groups'));
    return yield groups.insert(group);
  }).then((value) => done(null, value), (err) => done(err));
}

function getOperations(minDate, maxDate, accountId, done) {
  co(function*() {
    const db     = monk(config.mongo);
    const operations = coMonk(db.get('operations'));
    const conditions = [];
    if(minDate) {
      conditions.push({ date: { $gte: minDate } });
    }
    if(maxDate) {
      conditions.push({ date: { $lte: maxDate } });
    }
    if(accountId) {
      conditions.push({ account: accountId });
    }
    const criteria = {};
    if(conditions.length) {
      criteria.$and = conditions;
    }
    return yield operations.find(criteria);
  }).then((value) => done(null, value), (err) => done(err));
}