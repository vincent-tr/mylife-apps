import winston from 'winston';
import { getArg } from './cli';
import { getDefine } from './defines';

export function createLogger(namespace: string, options = {}) {
  const application = getDefine('applicationName');
  const level = getArg('loglevel', 'info');

  return winston.createLogger({
    defaultMeta: { application, namespace, ...options },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(info => `${info.timestamp} - ${info.namespace} [${info.level}] ${info.message}`)
        ),
        level
      }),
    ]
  });
}
