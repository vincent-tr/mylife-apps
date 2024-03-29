import { createLogger } from '../../logging';

const logger = createLogger('mylife:tools:server:api:decorators:method-logger');

export function methodLogger(method) {
  const { callee, service, name } = method;
  method.callee = async (session, ...args) => {
    logger.debug(`Calling ${service.name}.${name}`);
    const result = await callee(session, ...args);
    logger.debug(`Called ${service.name}.${name} : ${JSON.stringify(result)}`);
    return result;
  };
}
