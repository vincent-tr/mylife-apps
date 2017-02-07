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
        return response.status(500).json(err.message);
      }
      response.json(res);
    });
  });

  router.route('/groups').get(function(request, response) {
    getGroups((err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }
      response.json(res);
    });
  });

  router.route('/group').put(function(request, response) {
    const group = request.body;
    createGroup(group, (err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }
      logger.info(`group created: ${JSON.stringify(res)}`);
      response.json(res);
    });
  });

  router.route('/group').post(function(request, response) {
    const group = request.body;
    updateGroup(group, (err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }
      logger.info(`group updated: ${JSON.stringify(res)}`);
      response.json(res);
    });
  });

  router.route('/group').delete(function(request, response) {
    const { id } = request.body;
    deleteGroup(id, (err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }
      logger.info(`group deleted: ${id}`);
      response.json(res);
    });
  });

  router.route('/operations').get(function(request, response) {
    const { minDate, maxDate, account } = request.params;
    getOperations(minDate, maxDate, account, (err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
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

function updateGroup(group, done) {
  group._id = group.id;
  delete group.id;
  co(function*() {
    const db     = monk(config.mongo);
    const groups = coMonk(db.get('groups'));
    yield groups.update({ _id: group._id }, group);
    return group;
  }).then((value) => done(null, value), (err) => done(err));
}

function deleteGroup(id, done) {
  co(function*() {
    const db     = monk(config.mongo);
    const groups = coMonk(db.get('groups'));
    const operations = coMonk(db.get('operations'));

    const child = yield groups.findOne({ parent: id });
    if(child) { throw new Error(`Cannot delete group '${id}' because it has children groups`); }

    const operation = yield operations.findOne({ group: id });
    if(operation) { throw new Error(`Cannot delete group '${id}' because it contains operations`); }

    return yield groups.remove({ _id: id });
  }).then((value) => done(null, value), (err) => done(err));
}

function getOperations(minDate, maxDate, account, done) {
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
    if(account) {
      conditions.push({ account });
    }
    const criteria = {};
    if(conditions.length) {
      criteria.$and = conditions;
    }
    return yield operations.find(criteria);
  }).then((value) => done(null, value), (err) => done(err));
}