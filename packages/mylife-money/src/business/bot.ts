import { getStoreCollection, notifyView, createLogger } from 'mylife-tools-server';

const logger = createLogger('mylife:money:business:bot');

export function createBot(values) {
  const bots = getStoreCollection('bots');
  return bots.set(bots.entity.newObject(values));
}

export function updateBot(values) {
  const bots = getStoreCollection('bots');
  let existingBot = bots.get(values._id);
  existingBot = bots.entity.setValues(existingBot, values);
  existingBot = bots.set(existingBot);
  return existingBot;
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

export function logBotRun(runId: string, name: string, severity: 'debug' |'info' |'warning' |'error' |'fatal', message: string) {
  const botRuns = getStoreCollection('bot-runs');
  const run = botRuns.get(runId);
  const log = { date: new Date(), severity, name, message };
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
