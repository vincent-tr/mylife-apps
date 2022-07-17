import { createLogger } from './logging';
import { registerService } from './service-manager';

const logger = createLogger('mylife:tools:server:api-registry');

class Service {
  public readonly name: string;
  public readonly methods = new Map();

  constructor(meta) {
    Object.assign(this, meta);

    if (!this.name) {
      throw new Error('Missing name');
    }
  }

  findMethod(name) {
    return this.methods.get(name);
  }
}

class Method {
  private readonly callee;

  constructor(public readonly service, public readonly name, impl) {
    const list = Array.isArray(impl) ? [...impl] : [impl];
    this.callee = list.pop();
    const decorators = list.reverse();

    for (const decorator of decorators) {
      decorator(this);
    }
  }

  async call(...args) {
    return await this.callee(...args);
  }
}

class ApiRegistry {
  private readonly services: { [name: string]: Service } = {};

  async init({ apiServices }) {
    if (apiServices) {
      this.registerServices(apiServices);
    }
  }

  async terminate() {
    for (const key of Object.keys(this.services)) {
      logger.debug(`Deleting service '${key}'`);
      delete this.services[key];
    }
  }

  lookup(serviceName, methodName) {
    const service = this.services[serviceName];
    if (!service) {
      throw new Error(`Service '${serviceName}' does not exist`);
    }

    const method = service.findMethod(methodName);
    if (!method) {
      throw new Error(`Method '${methodName} does not exist on service '${service.name}'`);
    }

    return method;
  }

  registerService(simpl) {
    const service = new Service(simpl.meta);
    if (this.services[service.name]) {
      throw new Error(`Service '${service.name}' already exists`);
    }

    for (const [key, mimpl] of Object.entries(simpl)) {
      if (key === 'meta') {
        continue;
      }
      const method = new Method(service, key, mimpl);
      service.methods.set(key, method);
    }

    logger.debug(`Registering service '${service.name}'`);
    this.services[service.name] = service;
  }

  registerServices(impls) {
    for (const impl of impls) {
      this.registerService(impl);
    }
  }

  static readonly serviceName = 'api-registry';
}

registerService(ApiRegistry);

export function createDecoratorGroup(...decorators) {
  return (method) => {
    for (const decorator of decorators) {
      decorator(method);
    }
  };
}

export const api = {
  decorators: require('./api/decorators'),
  services: require('./api/services'),
};
