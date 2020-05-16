'use strict';

const fetch = require('node-fetch');
const { StoreView, StoreContainer, createLogger, registerService, getService, getMetadataEntity, getConfig } = require('mylife-tools-server');

const logger = createLogger('mylife:monitor:nagios-service');

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

const URL_SUFFIXES = {
  hostGroupList: 'nagios/cgi-bin/objectjson.cgi?query=hostgrouplist&details=true'
};

class NagiosService {
  async init() {
    const config = getConfig('nagios');
    this.prepareConfigData(config);

    this.collection = new NagiosView();
    this.entities = {
      group: getMetadataEntity('nagios-host-group'),
      host: getMetadataEntity('nagios-host'),
      service: getMetadataEntity('nagios-service'),
    };

    this.queue = getService('task-queue-manager').createQueue('nagios-service-queue');
    logger.debug(`Configure timer interval at ${config.interval} seconds`);
    this.timer = setInterval(() => this.queue.add('refresh', async () => this._refresh()), config.interval * 1000);
    this.queue.add('refresh', async () => this._refresh()); // refresh on start
  }

  prepareConfigData(config) {
    this.baseUrl = config.url;
    if(!this.baseUrl.endsWith('/')) {
      this.baseUrl += '/';
    }

    const user = encodeURIComponent(config.user);
    const pass = encodeURIComponent(config.pass);
    this.authHeader = 'Basic ' + new Buffer(`${user}:${pass}`).toString('base64');
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
    console.log(await this._query(URL_SUFFIXES.hostGroupList));
  }

  async _query(urlSuffix) {
    const url = this.baseUrl + urlSuffix;
    const headers = {Authorization: this.authHeader };
    const res = await fetch(url, { headers });

    if(res.status >= 400 && res.status < 600) {
      throw new Error(`HTTP error: ${res.status}: ${res.statusText}`);
    }

    const { result, data } = await res.json();
    if(result.type_code !== 0) {
      throw new Error(`Nagios api error (${result.type_code}): ${result.type_text} - ${result.message}`);
    }

    return data;
  }
}

NagiosService.serviceName = 'nagios-service';
NagiosService.dependencies = ['task-queue-manager', 'metadata-manager'];

registerService(NagiosService);
