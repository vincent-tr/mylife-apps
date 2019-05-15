'use strict';

const { createLogger, initDatabase, getDatabaseCollection, dbObjects } = require('mylife-tools-server');
const { operationsImport, executeRules } = require('./importer');

const { ObjectID } = dbObjects;
const logger = createLogger('mylife:money:api');

exports.createApi = async ({ app, express, apiHandler }) => {
  await initDatabase();

  const router = express.Router();
  app.use('/api', router);

  router.route('/accounts').get(apiHandler(async () => {
    return await getAccounts();
  }));

  router.route('/groups').get(apiHandler(async () => {
    return await getGroups();
  }));

  router.route('/group').put(apiHandler(async (group) => {
    const res = await createGroup(group);
    logger.info(`group created: ${JSON.stringify(res)}`);
    return res;
  }));

  router.route('/group').post(apiHandler(async (group) => {
    const res = await updateGroup(group);
    logger.info(`group updated: ${JSON.stringify(res)}`);
    return res;
  }));

  router.route('/group').delete(apiHandler(async ({ id }) => {
    const res = await deleteGroup(id);
    logger.info(`group deleted: ${id}`);
    return res;
  }));

  router.route('/operations').get(apiHandler(async ({ minDate, maxDate, account }) => {
    return await getOperations(minDate, maxDate, account);
  }));

  router.route('/operations_move').post(apiHandler(async (request, response) => {
    try {
      const { group, operations } = request.body;
      const status = await operationsMove(group, operations);
      logger.info(`Operations moved: ${JSON.stringify({ group, operations })} -> ${JSON.stringify(status)}`);
      response.json({});
    } catch(err) {
      logger.error(err);
      return response.status(500).json(err.message);
    }
  }));

  router.route('/operations_set_note').post(apiHandler(async ({ note, operations }) => {
    const status = await operationsSetNote(note, operations);
    logger.info(`Operations note set: ${JSON.stringify({ note, operations })} -> ${JSON.stringify(status)}`);
  }));

  router.route('/operations_import').post(apiHandler(async ({ account, content }) => {
    const count = await operationsImport(account, content);
    await executeRules();
    return count;
  }));

  router.route('/operations_execute_rules').post(apiHandler(async () => {
    return await executeRules();
  }));
};

async function getAccounts(done) {
  const accounts = getDatabaseCollection('accounts');
  return await accounts.find({});
}

async function getGroups(done) {
  const groups = getDatabaseCollection('groups');
  return await groups.find({});
}

async function createGroup(group, done) {
  const groups = getDatabaseCollection('groups');
  return await groups.insert(group);
}

async function updateGroup(group, done) {
  group._id = group.id;
  delete group.id;
  const groups = getDatabaseCollection('groups');
  await groups.update({ _id: group._id }, group);
  return group;
}

async function deleteGroup(id, done) {
  const groups = getDatabaseCollection('groups');
  const operations = getDatabaseCollection('operations');

  const child = await groups.findOne({ parent: id });
  if(child) { throw new Error(`Cannot delete group '${id}' because it has children groups`); }

  const operation = await operations.findOne({ group: id });
  if(operation) { throw new Error(`Cannot delete group '${id}' because it contains operations`); }

  return await groups.remove({ _id: id });
}

async function getOperations(minDate, maxDate, account, done) {
  const operations = getDatabaseCollection('operations');
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
  return await operations.find(criteria);
}

async function operationsMove(groupId, operationIds, done) {
  const operations = getDatabaseCollection('operations');
  return await operations.update(
    { _id: { $in: operationIds.map(id => new ObjectID(id)) } },
    { $set: { group: groupId ? new ObjectID(groupId) : null } },
    { multi: true }
  );
}

async function operationsSetNote(note, operationIds, done) {
  const operations = getDatabaseCollection('operations');
  return await operations.update(
    { _id: { $in: operationIds.map(id => new ObjectID(id)) } },
    { $set: { note: note ? note : null } },
    { multi: true }
  );
}
