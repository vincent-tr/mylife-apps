'use strict';

const { createLogger, getDatabaseCollection, dbObjects } = require('mylife-tools-server');
const business = require('./business');

const { ObjectID } = dbObjects;
const logger = createLogger('mylife:money:api');

exports.createApi = async ({ app, express, apiHandler }) => {

  const router = express.Router();
  app.use('/api', router);

  router.route('/accounts').get(apiHandler(async () => {
    return await business.getAccounts();
  }));

  router.route('/groups').get(apiHandler(async () => {
    return await business.getGroups();
  }));

  router.route('/group').put(apiHandler(async (group) => {
    const res = await business.createGroup(group);
    logger.info(`group created: ${JSON.stringify(res)}`);
    return res;
  }));

  router.route('/group').post(apiHandler(async (group) => {
    const res = await business.updateGroup(group);
    logger.info(`group updated: ${JSON.stringify(res)}`);
    return res;
  }));

  router.route('/group').delete(apiHandler(async ({ id }) => {
    const res = await business.deleteGroup(id);
    logger.info(`group deleted: ${id}`);
    return res;
  }));

  router.route('/operations').get(apiHandler(async ({ minDate, maxDate, account }) => {
    return await business.getOperations(minDate, maxDate, account);
  }));

  router.route('/operations_move').post(apiHandler(async (request, response) => {
    try {
      const { group, operations } = request.body;
      const status = await business.operationsMove(group, operations);
      logger.info(`Operations moved: ${JSON.stringify({ group, operations })} -> ${JSON.stringify(status)}`);
      response.json({});
    } catch(err) {
      logger.error(err);
      return response.status(500).json(err.message);
    }
  }));

  router.route('/operations_set_note').post(apiHandler(async ({ note, operations }) => {
    const status = await business.operationsSetNote(note, operations);
    logger.info(`Operations note set: ${JSON.stringify({ note, operations })} -> ${JSON.stringify(status)}`);
  }));

  router.route('/operations_import').post(apiHandler(async ({ account, content }) => {
    const count = await business.operationsImport(account, content);
    await business.executeRules();
    return count;
  }));

  router.route('/operations_execute_rules').post(apiHandler(async () => {
    return await business.executeRules();
  }));
};
