import { createLogger } from './logging';

const logger = createLogger('mylife:tools:server:service-manager');

type FIXME_any = any;

const serviceClasses = {};

export function registerService(Service) {
  const { serviceName } = Service;
  if (!(Service instanceof Function) || !serviceName) {
    throw new Error('Bad service provided');
  }
  if (serviceClasses[serviceName]) {
    throw new Error(`Service already exists: '${serviceName}'`);
  }

  serviceClasses[serviceName] = Service;
}

function findServiceClass(name: string) {
  return serviceClasses[name];
}

class ServiceManager {
  private readonly services: FIXME_any[] = [];
  private readonly servicesByName = new Map();
  private initOrder = [];

  constructor() {
  }

  add(serviceName: string) {
    const Service = findServiceClass(serviceName);
    if (!Service) {
      throw new Error(`Unknown service name: ${serviceName}`);
    }
    if (this.servicesByName.get(serviceName)) {
      throw new Error(`service name duplicate: ${serviceName}`);
    }

    const service = new Service();
    service.serviceName = Service.serviceName;
    service.dependencies = Service.dependencies;

    this.services.push(service);
    this.servicesByName.set(serviceName, service);

    logger.debug(`Service added: ${serviceName}`);

    return service;
  }

  async init(options) {
    for (const service of this.services) {
      this.resolveDependencies(service);
    }

    this.computeInitOrder();

    for (const serviceName of this.initOrder) {
      const service = this.servicesByName.get(serviceName);
      await service.init(options);
    }
  }

  private resolveDependencies(service) {
    for (const dependency of service.dependencies || []) {
      if (this.servicesByName.get(dependency)) {
        continue;
      }

      if (!findServiceClass(dependency)) {
        throw new Error(`Unknown dependency ${dependency} for service ${service.name}`);
      }

      const depService = this.add(dependency);
      this.resolveDependencies(depService);
    }
  }

  private computeInitOrder() {
    const order = [];
    const serviceNames = this.services.map(({ serviceName }) => serviceName);
    computeInitOrder(order, this.servicesByName, serviceNames, new Set(), 0);
    this.initOrder = order;
    logger.debug(`Computed init order: [ ${order.join(', ')} ]`);
  }

  async terminate() {
    const services = [...this.initOrder];
    services.reverse();
    for (const serviceName of services) {
      const service = this.servicesByName.get(serviceName);
      await service.terminate();
    }
  }

  getService(name: string) {
    const service = this.servicesByName.get(name);
    if (!service) {
      throw new Error(`Service not found: ${name}`);
    }

    return service;
  }

  fatal(error) {
    logger.error(`FATAL ERROR: ${error.stack}`);
    process.kill(process.pid, 'SIGTERM');
  }
}

function computeInitOrder(order, serviceMap, serviceNames, existingSet, recursiveCount) {
  if (recursiveCount > 50) {
    throw new Error('Cyclic service dependency');
  }

  for (const serviceName of serviceNames) {
    if (existingSet.has(serviceName)) {
      continue;
    }

    const { dependencies = [] } = serviceMap.get(serviceName);
    if (dependencies.length) {
      computeInitOrder(order, serviceMap, dependencies, existingSet, recursiveCount + 1);
    }

    order.push(serviceName);
    existingSet.add(serviceName);
  }
}

let manager;

export function getService(name: string) {
  return manager.getService(name);
}

export function fatal(err) {
  manager.fatal(err);
}

export async function runServices(options) {
  const task = () => waitForSignals('SIGINT', 'SIGTERM');
  await runTask({ task, ...options });
}

export async function runTask({ services, task, ...options }) {
  try {
    manager = new ServiceManager();
    for (const service of services) {
      manager.add(service);
    }

    await manager.init(options);
    await task();
    await manager.terminate();
    manager = null;

    process.exit();
  } catch (err) {
    logger.error(err.stack);
    process.exit(1);
  }
}

async function waitForSignals(...signals) {
  return new Promise((resolve) => {
    for (const sig of signals) {
      process.on(sig, resolve);
    }
  });
}
