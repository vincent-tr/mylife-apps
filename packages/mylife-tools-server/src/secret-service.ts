import fs from 'fs';
import path from 'path';
import { registerService, getService } from './service-manager';
import { createLogger } from './logging';
import { getConfig } from './config';
import chokidar from 'chokidar';

const logger = createLogger('mylife:tools:server:secret-service');

interface Configuration {
  readonly path: string;
}

class SecretService {
  private watcher: chokidar.FSWatcher;
  private readonly secrets = new Map<string, string>();

  async init() {
    const config = getConfig<Configuration>('secrets');

    const absPath = path.resolve(config.path);

    logger.debug(`Start watching path: '${absPath}'`);

    this.watcher = chokidar.watch(absPath, { persistent: true, ignoreInitial: false });
    this.watcher.on('error', this.onError);
    this.watcher.on('all', this.onChange);

    await waitReady(this.watcher);

    logger.debug('Started');
  }

  async terminate() {
    await this.watcher.close();
  }

  private readonly onError = (error: Error) => {
    logger.error(`FS watcher error: ${error.stack}`);
  };

  private readonly onChange = (eventName: 'add'|'addDir'|'change'|'unlink'|'unlinkDir', eventPath: string, stats?: fs.Stats) => {
    try {
      switch (eventName) {
        case 'add': {
          const key = path.basename(eventPath);
          if (key.startsWith('.')) {
            // k8s volumes adds internal stuff starting with '..'
            logger.debug(`eventPath '${eventPath}' ignored.`);
            break;
          }

          const value = fs.readFileSync(eventPath, 'utf8');

          this.secrets.set(key, value);
          logger.info(`Secret '${key}' added. (eventPath='${eventPath}')`);
          break;
        }

        case 'change': {
          const key = path.basename(eventPath);
          if (key.startsWith('.')) {
            // k8s volumes adds internal stuff starting with '..'
            logger.debug(`eventPath '${eventPath}' ignored.`);
            break;
          }

          const value = fs.readFileSync(eventPath, 'utf8');

          this.secrets.set(key, value);
          logger.info(`Secret '${key}' updated. (eventPath='${eventPath}')`);
          break;
        }
  
        case 'unlink': {
          const key = path.basename(eventPath);
          if (key.startsWith('.')) {
            // k8s volumes adds internal stuff starting with '..'
            logger.debug(`eventPath '${eventPath}' ignored.`);
            break;
          }

          this.secrets.delete(key);
          logger.info(`Secret '${key}' deleted. (eventPath='${eventPath}')`);
          break;
        }
  
        default:
          logger.debug(`Received unhandled operation: '${eventName}' (eventPath='${eventPath}')`);
          break;
      }
    } catch(err) {
      logger.error(`Failed to process FS watcher event (eventName='${eventName}', eventPath='${eventPath}'): ${err.stack}`);
    }
  };

  keys() {
    return this.secrets.keys();
  }

  find(key: string) {
    return this.secrets.get(key);
  }

  get(key: string) {
    const value = this.secrets.get(key);

    if (value === undefined) {
      throw new Error(`Secret with key '${key}' does not exist`);
    }

    return value;
  }

  static readonly serviceName = 'secret-service';
  static readonly dependencies: string[] = [];
}

registerService(SecretService);

async function waitReady(watcher: chokidar.FSWatcher) {
  await new Promise<void>((resolve, error) => {
    const onEnd = () => {
      watcher.off('ready', onReady);
      watcher.off('error', onError);
    };

    const onReady = () => {
      onEnd();
      resolve();
    }

    const onError = (err: Error) => {
      onEnd();
      error(err);
    }

    watcher.once('ready', onReady);
    watcher.once('error', onError);
  });
}

export function listSecretKeys() {
  return getService('secret-service').keys();
}

export function getSecret(key: string) {
  return getService('secret-service').get(key);
}

export function findSecret(key: string) {
  return getService('secret-service').find(key);
}
