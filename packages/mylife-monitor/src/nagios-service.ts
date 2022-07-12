'use strict';

// http://nagios.mti-team2.dyndns.org/nagios/jsonquery.html 
// https://labs.nagios.com/2014/06/19/exploring-the-new-json-cgis-in-nagios-core-4-0-7-part-1/ 
// https://github.com/NagiosEnterprises/nagioscore/blob/master/include/statusdata.h

import fetch from 'node-fetch';
const { StoreView, StoreContainer, createLogger, registerService, getService, getMetadataEntity, getConfig } = require('mylife-tools-server');

type FIXME_any = any;

const logger = createLogger('mylife:monitor:nagios-service');

class NagiosDataView extends StoreContainer {
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

class NagiosSummaryView extends StoreContainer {
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
  statusServiceList: 'nagios/cgi-bin/statusjson.cgi?query=servicelist&details=true'
};

class NagiosService {
  private dataCollection;
  private summaryCollection;
  private entities;
  private queue;
  private timer;
  private baseUrl;
  private authHeader;

  async init() {
    const config = getConfig('nagios');
    this.prepareConfigData(config);

    this.dataCollection = new NagiosDataView();
    this.summaryCollection = new NagiosSummaryView();
    this.entities = {
      group: getMetadataEntity('nagios-host-group'),
      host: getMetadataEntity('nagios-host'),
      service: getMetadataEntity('nagios-service'),
      summary: getMetadataEntity('nagios-summary'),
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
    this.authHeader = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
  }

  async terminate() {
    clearInterval(this.timer);
    this.timer = null;
    await getService('task-queue-manager').closeQueue('nagios-service-queue');

    this.dataCollection = null;
    this.summaryCollection = null;
    this.entities = null;
  }

  getDataCollection() {
    return this.dataCollection;
  }

  getSummaryCollection() {
    return this.summaryCollection;
  }

  async _refresh() {
    const schema = new Schema();
    schema.addObjectHostGroupList(await this._query(URL_SUFFIXES.objectHostGroupList));
    schema.addStatusHostList(await this._query(URL_SUFFIXES.statusHostList));
    schema.addStatusServiceList(await this._query(URL_SUFFIXES.statusServiceList));
    this.dataCollection.replaceAll(schema.buildDataObjects(this.entities));
    this.summaryCollection.replaceAll(schema.buildSummaryObjects(this.entities));
  }

  async _query(urlSuffix) {
    const url = this.baseUrl + urlSuffix;
    const headers = {Authorization: this.authHeader };
    const res = await fetch(url, { headers });

    if(res.status >= 400 && res.status < 600) {
      throw new Error(`HTTP error: ${res.status}: ${res.statusText}`);
    }

    const { result, data } = await res.json() as FIXME_any;
    if(result.type_code !== 0) {
      throw new Error(`Nagios api error (${result.type_code}): ${result.type_text} - ${result.message}`);
    }

    return data;
  }

  static serviceName = 'nagios-service';
  static dependencies = ['task-queue-manager', 'metadata-manager'];
}

registerService(NagiosService);

class Schema {
  private readonly groups = new Map();
  private readonly hosts = new Map();
  private readonly services = new Map();

  addObjectHostGroupList(data) {
    for(const item of Object.values(data.hostgrouplist)) {
      this.addObjectHostGroup(item);
    }
  }

  addObjectHostGroup(item) {
    const group = { 
      _id: `group:${item.group_name}`,
      code: item.group_name,
      display: item.alias,
      members: item.members
    };

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
      _id: `host:${item.name}`,
      code: item.name,
      display: item.name,
      status: parseHostStatus(item.status)
    };

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
    const host = item.host_name;
    const service = {
      _id: `service:${host}:${item.description}`,
      host: `host:${host}`,
      code: item.description,
      display: item.description,
      status: parseServiceStatus(item.status)
    };

    this.addStatusData(service, item);
    this.services.set(service._id, service);
  }

  buildDataObjects(entities) {
    const objects = [];

    for(const group of this.groups.values()) {
      for(const member of group.members) {
        const host = this.hosts.get(`host:${member}`);

        // no atomicity
        if(!host) {
          continue;
        }

        host.group = group._id;
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
      const host = this.hosts.get(service.host);
      // no atomicity, drop it
      if(!host) {
        continue;
      }

      objects.push(entities.service.newObject(service));
    }

    return objects;
  }

  buildSummaryObjects(entities) {
    const hosts = { _id: 'hosts', type: 'host', ok: 0, warnings: 0, errors: 0 };

    for(const host of this.hosts.values()) {
      switch(host.status) {
        case 'pending':
        case 'up':
          ++hosts.ok;
          break;

        case 'down':
        case 'unreachable':
          ++hosts.errors;
          break;
      }
    }

    const services = { _id: 'services', type: 'service', ok: 0, warnings: 0, errors: 0 };

    for(const service of this.services.values()) {
      switch(service.status) {
        case 'pending':
        case 'ok':
          ++services.ok;
          break;

        case 'warning':
          ++services.warnings;
          break;
  
        case 'unknown':
        case 'critical':
          ++services.errors;
          break;
      }
    }

    return [
      entities.summary.newObject(hosts),
      entities.summary.newObject(services),
    ];
  }
}

const hostStatusMap = new Map();
hostStatusMap.set(1, 'pending');
hostStatusMap.set(2, 'up');
hostStatusMap.set(4, 'down');
hostStatusMap.set(8, 'unreachable');

function parseHostStatus(value) {
  return hostStatusMap.get(value) || null;
}

const serviceStatusMap = new Map();
serviceStatusMap.set(1, 'pending');
serviceStatusMap.set(2, 'ok');
serviceStatusMap.set(4, 'warning');
serviceStatusMap.set(8, 'unknown');
serviceStatusMap.set(16, 'critical');

function parseServiceStatus(value) {
  return serviceStatusMap.get(value) || null;
}
