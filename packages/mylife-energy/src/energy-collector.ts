import * as mqtt from 'async-mqtt';

const { createLogger, registerService, getService, getDatabaseCollection, getConfig, getStoreCollection } = require('mylife-tools-server');

const logger = createLogger('mylife:enery:energy-collector');

type FIXME_any = any;

// MQTT message sent by esphome
type Message = {
  sensorId: string,
  deviceClass: string,
  stateClass: string,
  unitOfMeasurement: string,
  accuracyDecimals: number,
  value: number
}

class EnergyCollector {
  private client: mqtt.AsyncClient;

  async init(options) {
    const { serverUrl } = getConfig('bus');

    logger.info(`collector init, connecting to ${serverUrl}`);
    this.client = mqtt.connect(serverUrl, { resubscribe: true });

    this.client.subscribe('+/energy');

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

    try {
      const message = parseMessage(topic, payload);
      const sensors = getStoreCollection('sensors');
      const sensor = findOrCreateSensor(sensors, message);
      const sensorId = getService('database').newObjectID(sensor._id);

      const record = { timestamp: new Date(), sensor: sensorId, value: message.value };
      const collection = getDatabaseCollection('measures');
      logger.debug(`insert record: ${JSON.stringify(record)}`);
      collection.insertOne(record).catch(err => logger.error(`Could not insert record ${JSON.stringify(record)}: ${err.stack}`));

    } catch(err) {
      logger.error(`Error processing message: topic= '${topic}', payload= '${payload}': ${err.stack}`);
    }
  };

  
  static readonly serviceName = 'energy-collector';
  static readonly dependencies = ['database', 'store'];
}

registerService(EnergyCollector);

function parseMessage(topic: string, payload: string) {
  const {
    id: sensorId,
    device_class: deviceClass,
    state_class: stateClass,
    unit_of_measurement: unitOfMeasurement,
    accuracy_decimals: accuracyDecimals,
    value
  } = JSON.parse(payload);

  const message: Message = {
    sensorId,
    deviceClass,
    stateClass,
    unitOfMeasurement,
    accuracyDecimals,
    value,
  };

  return message;
}

function findOrCreateSensor(sensors: FIXME_any, message: Message) {
  const candidates = sensors.filter(sensor => 
    sensor.sensorId === message.sensorId &&
    sensor.deviceClass === message.deviceClass &&
    sensor.stateClass === message.stateClass &&
    sensor.unitOfMeasurement === message.unitOfMeasurement &&
    sensor.accuracyDecimals === message.accuracyDecimals);

  if (candidates.length > 0) {
    return candidates[0];
  }

  const sensor = sensors.entity.newObject({
    sensorId: message.sensorId,
    deviceClass: message.deviceClass,
    stateClass: message.stateClass,
    unitOfMeasurement: message.unitOfMeasurement,
    accuracyDecimals: message.accuracyDecimals,
  });

  return sensors.set(sensor);
}
