import path from 'path';
import readConfig from 'read-config';
import deepFreeze from 'deep-freeze';
import { getArg } from './cli';
import { getDefine } from './defines';

let config;

export function getConfigs() {
  if (!config) {
    config = loadConfig();
  }
  return config;
}

export function getConfig<T>(name: string, defaultValue?: T) {
  const value = getConfigs()[name];
  return value === undefined ? defaultValue : value as T;
}

function loadConfig() {
  const configFile = getArg('config') || path.join(getDefine('baseDirectory'), 'config.json');
  const result = readConfig(configFile);
  deepFreeze(result);
  return result;
}
