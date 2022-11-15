import * as mqtt from 'async-mqtt';

const { createLogger, registerService, getDatabaseCollection, getConfig } = require('mylife-tools-server');

const logger = createLogger('mylife:enery:energy-collector');

class EnergyCollector {
  private client: mqtt.AsyncClient;

  async init(options) {
    const { serverUrl } = getConfig('bus');

    logger.info(`collector init, connecting to ${serverUrl}`);
    this.client = mqtt.connect(serverUrl, { resubscribe: true });

    this.client.subscribe('+/energy/+');

    this.client.on('connect', () => logger.info('connected to bus'));
    this.client.on('close', () => logger.info('disconnected from bus'));

    this.client.on('message', this.onMessage);
  }

  async terminate() {
    logger.info('collector terminate');
    await this.client.end(true);
  }

  private readonly onMessage = (topic: string, payload: string) => {

    logger.debug(`got message: topic= '${topic}', payload= '${payload}'`);

    const [instance, domain, sensor] = topic.split('/');
    const value = parseFloat(payload);

    const collection = getDatabaseCollection('measures');
    const record = { timestamp: new Date(), sensor, value };

    logger.debug(`insert record: ${JSON.stringify(record)}`);

    collection.insertOne(record).catch(err => logger.error(`Could not insert record ${JSON.stringify(record)}: ${err.stack}`));
  };

  static readonly serviceName = 'energy-collector';
  static readonly dependencies = ['database'];
}

registerService(EnergyCollector);

function fireAsync<T>(target: () => Promise<T>) {
  target().catch(err => logger.error(`Unhandled promise rejection: ${err.stack}`));
}
