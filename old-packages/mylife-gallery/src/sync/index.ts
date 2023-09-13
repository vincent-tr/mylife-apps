import { createLogger, registerService, getConfig } from 'mylife-tools-server';
import { utils } from 'mylife-tools-common';
import { ManagerTask } from './manager-task';

const logger = createLogger('mylife:gallery:sync:server');

class SyncServer {
  private timer: SyncInterval;
  private running: Promise<void>;
  private stopping = false;

  async init() {
    const interval = getConfig('syncInterval');
    this.timer = new SyncInterval(interval, () => this._run());

    this.running = null;
    this.stopping = false;

    logger.debug(`Sync server started (interval = ${interval})`);
  }

  async terminate() {
    this.timer.stop();

    this.stopping = true;
    if (this.running) {
      await this.running;
    }

    logger.debug('Sync server stopped');
  }

  async _run() {
    if (this.running) {
      return;
    }

    const deferred = utils.defer<void>();
    this.running = deferred.promise;

    logger.debug('Starting sync');
    const perf = new PerfTimer();

    try {
      const task = new ManagerTask();

      for (;;) {
        if (this.stopping) {
          logger.debug('Sync task interrupted because stopping');
          break;
        }

        if (!(await task.runStep())) {
          break;
        }
      }
    } catch (err) {
      logger.error(err.stack);
    } finally {
      logger.debug(`Sync done in ${perf.elapsed().toFixed(3)}s`);

      this.running = null;
      deferred.resolve();
    }
  }

  static readonly serviceName = 'sync-server';
}

registerService(SyncServer);

class SyncInterval {
  private readonly  timer: NodeJS.Timer;

  constructor(interval, callback) {
    this.timer = setInterval(callback, interval * 1000);
  }

  stop() {
    clearInterval(this.timer);
  }
}

class PerfTimer {
  private readonly startTime = Date.now();

  elapsed() {
    const elapsedTime = Date.now() - this.startTime;
    return elapsedTime / 1000;
  }
}
