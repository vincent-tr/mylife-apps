import cron from 'node-cron';
import { getStoreCollection, notifyView, createLogger, getService } from 'mylife-tools-server';

const logger = createLogger('mylife:money:business:bots');

export function createBot(values) {
  validateSchedule(values);
  const bots = getStoreCollection('bots');
  return bots.set(bots.entity.newObject(values));
}

export function updateBot(values) {
  validateSchedule(values);
  const bots = getStoreCollection('bots');
  let existingBot = bots.get(values._id);
  existingBot = bots.entity.setValues(existingBot, values);
  existingBot = bots.set(existingBot);
  return existingBot;
}

export function clearBotState(id: string) {
  logger.debug(`clea bot state '${id}'`);
  const bots = getStoreCollection('bots');
  let bot = bots.get(id);
  bot = bots.entity.getField('state').resetValue(bot);
  bots.set(bot);
}

function validateSchedule(values) {
  // note: cannot easily validate isomorophic
  if (values.schedule && !cron.validate(values.schedule)) {
    throw new Error(`Invalid schedule '${values.schedule}'`);
  }
}

export function deleteBot(id: string) {
  logger.debug(`drop bot '${id}'`);
  const bots = getStoreCollection('bots');
  const botRuns = getStoreCollection('bot-runs');

  const runs = botRuns.filter(run => run.bot === id);
  logger.debug(`found children runs: ${JSON.stringify(runs.map(run => run._id))}`);

  for (const run of runs) {
    botRuns.delete(run._id);
  }

  bots.delete(id);
}

export function notifyBots(session) {
  const bots = getStoreCollection('bots');
  return notifyView(session, bots.createView());
}

export function startBot(botId: string) {
  const service = getService('bot-service');
  service.startBot(botId);
}

export function startBotRun(botId: string): string {
  const botRuns = getStoreCollection('bot-runs');
  const values = {
    bot: botId,
    start: new Date(),
    logs: [],
  };

  const run = botRuns.set(botRuns.entity.newObject(values));
  return run._id;
}

export function endBotRun(runId: string, result: 'success' | 'warning' | 'error') {
  const botRuns = getStoreCollection('bot-runs');
  const run = botRuns.get(runId);
  const values = {
    end: new Date(),
    result
  };

  botRuns.set(botRuns.entity.setValues(run, values));
}

export function logBotRun(runId: string, severity: 'debug' |'info' |'warning' |'error' |'fatal', message: string) {
  const botRuns = getStoreCollection('bot-runs');
  const run = botRuns.get(runId);
  const log = { date: new Date(), severity, message };
  const values = { logs: [...run.logs, log] };

  botRuns.set(botRuns.entity.setValues(run, values));
}

export function updateBotState(botId: string, state: any) {
  const values = { _id: botId, state };
  updateBot(values);
}

export function notifyBotRuns(session, botId: string) {
  const botRuns = getStoreCollection('bot-runs');
  return notifyView(session, botRuns.createView(run => run.bot === botId));
}
