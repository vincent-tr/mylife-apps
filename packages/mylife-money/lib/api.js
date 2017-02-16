'use strict';

const { ObjectID } = require('mongodb');
const monk         = require('monk');
const config       = require('../conf/config');
const coMonk       = require('co-monk');
const co           = require('co');
const express      = require('express');
const log4js       = require('log4js');
const logger       = log4js.getLogger('mylife:money:api');
const { operationsImport, executeRules } = require('./importer');

const db = monk(config.mongo);

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
    const { minDate, maxDate, account } = request.query;
    getOperations(minDate, maxDate, account, (err, res) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }
      response.json(res);
    });
  });

  router.route('/operations_move').post(function(request, response) {
    const { group, operations } = request.body;
    operationsMove(group, operations, (err, status) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }
      logger.info(`Operations moved: ${JSON.stringify({ group, operations })} -> ${JSON.stringify(status)}`);
      response.json({});
    });
  });

  router.route('/operations_import').post(function(request, response) {
    const { account, content } = request.body;
    operationsImport(account, content, (err, count) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }

      executeRules((err) => {
        if(err) {
          logger.error(err);
          return response.status(500).json(err.message);
        }

        response.json(count);
      });
    });
  });

  router.route('/operations_execute_rules').post(function(request, response) {
    executeRules((err, count) => {
      if(err) {
        logger.error(err);
        return response.status(500).json(err.message);
      }

      response.json(count);
    });
  });

  return router;
};

function getAccounts(done) {
  co(function*() {
    const accounts = coMonk(db.get('accounts'));
    return yield accounts.find({});
  }).then((value) => done(null, value), (err) => done(err));
}

function getGroups(done) {
  co(function*() {
    const groups = coMonk(db.get('groups'));
    return yield groups.find({});
  }).then((value) => done(null, value), (err) => done(err));
}

function createGroup(group, done) {
  co(function*() {
    const groups = coMonk(db.get('groups'));
    return yield groups.insert(group);
  }).then((value) => done(null, value), (err) => done(err));
}

function updateGroup(group, done) {
  group._id = group.id;
  delete group.id;
  co(function*() {
    const groups = coMonk(db.get('groups'));
    yield groups.update({ _id: group._id }, group);
    return group;
  }).then((value) => done(null, value), (err) => done(err));
}

function deleteGroup(id, done) {
  co(function*() {
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
    const operations = coMonk(db.get('operations'));
    const criteria = {};
    if(minDate) {
      criteria.date = criteria.date || {};
      criteria.date.$gte = new Date(parseInt(minDate, 10));
    }
    if(maxDate) {
      criteria.date = criteria.date || {};
      criteria.date.$lte = new Date(parseInt(maxDate, 10));
    }
    if(account) {
      criteria.account = { $eq: new ObjectID(account) };
    }
    return yield operations.find(criteria);
  }).then((value) => done(null, value), (err) => done(err));
}

function operationsMove(groupId, operationIds, done) {
  co(function*() {
    const operations = coMonk(db.get('operations'));
    return yield operations.update(
      { _id: { $in: operationIds.map(id => new ObjectID(id)) } },
      { $set: { group: groupId ? new ObjectID(groupId) : null } },
      { multi: true }
    );
  }).then((status) => done(null, status), (err) => done(err));
}