'use strict';

const { StoreView, StoreContainer, createLogger, registerService, getService, getMetadataEntity } = require('mylife-tools-server');

const logger = createLogger('mylife:monitor:nagios-service');

const REFRESH_INTERVAL = 30000;

class NagiosView extends StoreContainer {
  constructor() {
    super();
  }

  set(key, entity, values) {
    const object = entity.newObject({ _id: key, ...values });
    this._set(object);
  }

  delete(key) {
    this._delete(key);
  }

  createView(filterCallback = () => true) {
    const view = new StoreView(this);
    view.setFilter(filterCallback);
    return view;
  }
}

class NagiosService {
  async init(options) {
    this.collection = new NagiosView();
    this.entities = {
      group: getMetadataEntity('nagios-host-group'),
      host: getMetadataEntity('nagios-host'),
      service: getMetadataEntity('nagios-service'),
    };

    this.queue = getService('task-queue-manager').createQueue('nagios-service-queue');
    this.timer = setInterval(() => this.queue.add('refresh', async () => this._refresh()), REFRESH_INTERVAL);
  }

  async terminate() {
    clearInterval(this.timer);
    this.timer = null;
    await getService('task-queue-manager').closeQueue('nagios-service-queue');

    this.collection = null;
    this.entities = null;
  }

  getCollection() {
    return this.collection;
  }

  async _refresh() {
    // TODO
  }
}

NagiosService.serviceName = 'nagios-service';
NagiosService.dependencies = ['task-queue-manager', 'metadata-manager'];

registerService(NagiosService);
