import cron from 'node-cron';
import { createLogger, registerService, getStoreCollection, StoreEvent } from 'mylife-tools-server';
import * as business from '../business';
import { Bot, BotLogSeverity, BotExecutionContext } from './api';

import { test } from './test';

const logger = createLogger('mylife:money:bot-service');

type BotResult = 'success' | 'warning' | 'error';

class BotService {
  private readonly crons = new Map<string, BotCron>();

  async init() {
    const bots = getStoreCollection('bots');
    bots.on('change', this.onBotsChange);

    for (const bot of bots.list()) {
      this.crons.set(bot._id, new BotCron(bot));
    }

    logger.debug('Bot service started');
  }

  async terminate() {
    const bots = getStoreCollection('bots');
    bots.off('change', this.onBotsChange);

    await Promise.all(Array.from(this.crons.values()).map(botCron => botCron.terminateAndWait()));
    this.crons.clear();

    logger.debug('Bot service stopped');
  }

  private readonly onBotsChange = (event: StoreEvent) => {
    switch (event.type) {
      case 'create': {
        const bot = event.after;
        this.crons.set(bot._id, new BotCron(bot));
        break;
      }

      case 'update': {
        const bot = event.after;
        const botCron = this.crons.get(bot._id);
        botCron.update(bot);
        break;
      }

      case 'remove': {
        const bot = event.before;
        const botCron = this.crons.get(bot._id);
        botCron.terminateNoWait();
        this.crons.delete(bot._id);
        break;
      }
    }
  };

  static readonly serviceName = 'bot-service';
  static readonly dependencies = ['store'];
}

registerService(BotService);

class BotCron {
  private readonly id: string;
  private cron: string;
  private readonly instance: Bot;
  private currentRun: BotRun;

  constructor(bot) {
    this.id = bot._id;
    this.cron = bot.schedule;
    this.instance = test; // TODO: select with bot.type
    addCron(this.id, this.cron, this.onCron);
  }

  update(bot) {
    if (bot.schedule === this.cron) {
      return;
    }

    logger.debug(`bot schedule updated: '${bot.name}' (id='${this.id}', type='${bot.type}')`);

    removeCron(this.id);
    this.cron = bot.schedule;
    addCron(this.id, this.cron, this.onCron);
  }

  terminateNoWait() {
    removeCron(this.id);

    const run = this.currentRun;
    if (run) {
      run.abort();
    }
  }

  async terminateAndWait() {
    this.terminateNoWait();

    const run = this.currentRun;
    if (run) {
      await run.wait();
    }
  }

  private readonly onCron = () => {
    if (this.currentRun) {
      const bots = getStoreCollection('bots');
      const bot = bots.get(this.id);
      logger.warn(`got cron trigger for bot '${bot.name}' (id='${this.id}', type='${bot.type}'), but it is already running. Skipping`);
      return;
    }

    this.currentRun = new BotRun(this.id, this.instance);
    this.currentRun.wait().then(() => {
      this.currentRun = null;
    })
  };
}

class BotRun {
  private readonly runId: string;
  private readonly promise: Promise<void>;
  private readonly controller = new AbortController();
  private result: BotResult = 'success';

  constructor(private readonly botId: string, instance: Bot) {
    this.runId = business.startBotRun(botId);

    const bots = getStoreCollection('bots');
    const bot = bots.get(this.botId);

    const context: BotExecutionContext = {
      configuration: bot.configuration,
      state: bot.state,
      signal: this.controller.signal,
    
      setState: (state: any) => {
        business.updateBotState(this.botId, state);
      },
    
      log: (severity: BotLogSeverity, message: string) => {
        business.logBotRun(this.runId, severity, message);

        switch (severity) {
          case 'warning':
            if (this.result === 'success') {
              this.result = 'warning';
            }
            break;

          case 'error':
          case 'fatal':
            this.result = 'error';
            break;
        }
      }
    };

    this.promise = this.runInstance(instance, context);
  }

  private async runInstance(instance: Bot, context: BotExecutionContext) {
    try {
      await instance(context);
    } catch(err) {
      const bots = getStoreCollection('bots');
      const bot = bots.get(this.botId);
      logger.error(`error running bot '${bot.name}' (id='${this.botId}', type='${bot.type}'): ${err.stack}`);
      context.log('fatal', err.stack);
    }

    business.endBotRun(this.runId, this.result);
  }

  async wait() {
    await this.promise;
  }

  abort() {
    this.controller.abort();
  }
}

function addCron(id: string, cronExpression: string, callback: () => void) {
  cron.schedule(cronExpression, callback, { name:  id });
}

function removeCron(id: string) {
  const tasks = cron.getTasks();
  const task = tasks.get(id);
  task.stop();
  tasks.delete(id);
}