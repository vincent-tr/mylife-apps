'use strict';

const { createLogger } = require('mylife-tools-server');
const business = require('./business');

const logger = createLogger('mylife:money:api');

exports.webApiFactory = async ({ app, express, webApiHandler }) => {

  const router = express.Router();
  app.use('/api', router);

  router.route('/accounts').get(webApiHandler(async () => {
    return await business.getAccounts();
  }));

  router.route('/groups').get(webApiHandler(async () => {
    return await business.getGroups();
  }));

  router.route('/group').put(webApiHandler(async (group) => {
    const res = await business.createGroup(group);
    logger.info(`group created: ${JSON.stringify(res)}`);
    return res;
  }));

  router.route('/group').post(webApiHandler(async (group) => {
    const res = await business.updateGroup(group);
    logger.info(`group updated: ${JSON.stringify(res)}`);
    return res;
  }));

  router.route('/group').delete(webApiHandler(async ({ id }) => {
    const res = await business.deleteGroup(id);
    logger.info(`group deleted: ${id}`);
    return res;
  }));

  router.route('/operations').get(webApiHandler(async ({ minDate, maxDate, account }) => {
    return await business.getOperations(minDate, maxDate, account);
  }));

  router.route('/operations_move').post(webApiHandler(async ({ group, operations }) => {
    const status = await business.operationsMove(group, operations);
    logger.info(`Operations moved: ${JSON.stringify({ group, operations })} -> ${JSON.stringify(status)}`);
    return status;
  }));

  router.route('/operations_set_note').post(webApiHandler(async ({ note, operations }) => {
    const status = await business.operationsSetNote(note, operations);
    logger.info(`Operations note set: ${JSON.stringify({ note, operations })} -> ${JSON.stringify(status)}`);
  }));

  router.route('/operations_import').post(webApiHandler(async ({ account, content }) => {
    const count = await business.operationsImport(account, content);
    await business.executeRules();
    return count;
  }));

  router.route('/operations_execute_rules').post(webApiHandler(async () => {
    return await business.executeRules();
  }));
};
