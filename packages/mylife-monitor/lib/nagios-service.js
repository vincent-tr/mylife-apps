'use strict';

const fetch = require('node-fetch');
const { StoreView, StoreContainer, createLogger, registerService, getService, getMetadataEntity, getConfig } = require('mylife-tools-server');

const logger = createLogger('mylife:monitor:nagios-service');

class NagiosView extends StoreContainer {
  constructor() {
    super();
  }

  replaceAll(objects) {
    this._replaceAll(objects);
  }

  createView(filterCallback = () => true) {
    const view = new StoreView(this);
    view.setFilter(filterCallback);
    return view;
  }
}

const URL_SUFFIXES = {
  objectHostGroupList: 'nagios/cgi-bin/objectjson.cgi?query=hostgrouplist&details=true',
  statusHostList: 'nagios/cgi-bin/statusjson.cgi?query=hostlist&details=true',
  statusServiceList: 'nagios/cgi-bin/statusjson.cgi?query=servicelist&details=true';
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
    const schema = new Schema();
    schema.addObjectHostGroupList(await this._query(URL_SUFFIXES.objectHostGroupList));
    schema.addStatusHostList(await this._query(URL_SUFFIXES.statusHostList));
    schema.addStatusServiceList(await this._query(URL_SUFFIXES.statusServiceList));
    this.collection.replaceAll(schema.buildObjects(this.entities));
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

class Schema {
  constructor() {
    this.groups = new Map();
    this.hosts = new Map();
    this.services = new Map();
  }

  addObjectHostGroupList(data) {
    for(const item of Object.values(data.hostgrouplist)) {
      this.addObjectHostGroup(item);
    }
  }

  addObjectHostGroup(item) {
    const group = { 
      code: item.groupe_name,
      display: item.alias,
      members: item.members
    };

    group._id = `group:${group.code}`;
    this.groups.set(group._id, group);
  }

  addStatusHostList(data) {
    for(const item of Object.values(data.hostlist)) {
      this.addStatusHost(item);
    }
  }

  addStatusData(object, item) {
    object.statusText = item.plugin_output;
    object.currentAttempt = item.current_attempt;
    object.maxAttempts = item.max_attempts;
    object.lastCheck = new Date(item.last_check);
    object.nextCheck = new Date(item.next_check);
    object.lastStateChange = new Date(item.last_state_change);
    object.isFlapping = item.is_flapping;
  }

  addStatusHost(item) {
    const host = {
      code: item.name,
      display: item.name,
      status: item.status // TODO: enum
    };

    host._id = `host:${host.code}`;
    this.addStatusData(host, item);
    this.hosts.set(host._id, host);
  }

  addStatusServiceList(data) {
    for(const host of Object.values(data.servicelist)) {
      for(const item of Object.values(host)) {
        this.addStatusService(item);
      }
    }
  }

  addStatusService(item) {
    const service = {
      host: item.host_name,
      code: item.description,
      display: item.description,
      status: item.status // TODO: enum
    };

    service._id = `service:${service.host}:${service.code}`;
    this.addStatusData(service, item);
    this.services.set(service._id, service);
  }

  buildObjects(entities) {
    const objects = [];

    for(const group of this.groups.values()) {
      for(const member of group.members) {
        const host = this.hosts.get(`host:${member}`);

        // no atomicity
        if(!host) {
          continue;
        }

        host.group = group.code;
      }
      
      objects.push(entities.group.newObject(group));
    }

    for(const host of this.hosts.values()) {
      // no atomicity, drop it
      if(!host.group) {
        continue;
      }

      objects.push(entities.host.newObject(host));
    }

    for(const service of this.services.values()) {
      const host = this.hosts.get(`host:${service.host}`);
      // no atomicity, drop it
      if(!host) {
        continue;
      }

      objects.push(entities.service.newObject(service));
    }

    return objects;
  }
}
