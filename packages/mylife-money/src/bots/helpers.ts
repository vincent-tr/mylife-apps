import { BotExecutionContext } from './api';
import { findSecret } from 'mylife-tools-server';

const SECRET_PREFIX = 'secret:';

export function processSecret(context: BotExecutionContext, value: string) {
  if (!value.startsWith(SECRET_PREFIX)) {
    return value;
  }

  const key = value.substring(SECRET_PREFIX.length);
  const secretValue = findSecret(key);

  if (secretValue === undefined) {
    context.log('warning', `La clé de secret '${key}' n'existe pas.`);
    return value;
  }

  context.log('debug', `Utilisation du secret de la clé '${key}'.`);
  return secretValue;
}
