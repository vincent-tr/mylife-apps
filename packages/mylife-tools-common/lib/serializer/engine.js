'use strict';

exports.serialize = serialize;
exports.deserialize = deserialize;
exports.addPlugin = addPlugin;

const plugins = [];
const pluginByNames = new Map();

function addPlugin(plugin) {
  plugins.push(plugin);
  pluginByNames.set(plugin.name, plugin);
}

function serialize(payload) {
  if(typeof payload !== 'object' || payload === null) {
    return payload;
  }

  if(Array.isArray(payload)) {
    return payload.map(item => serialize(item));
  }

  for(const plugin of plugins) {
    if(plugin.is(payload)) {
      return {
        __type: plugin.name,
        value: plugin.serialize(payload)
      };
    }
  }

  if(payload.constructor === {}.constructor) {
    const raw = {};
    for(const [ key, value ] of Object.entries(payload)) {
      raw[key] = serialize(value);
    }
    return raw;
  }

  throw new Error(`Cannot serialize value : ${payload}`);
}

function deserialize(raw) {
  if(typeof raw !== 'object' || raw === null) {
    return raw;
  }

  if(Array.isArray(raw)) {
    return raw.map(item => deserialize(item));
  }

  if(raw.__type) {
    const plugin = pluginByNames.get(raw.__type);
    if(!plugin) {
      throw new Error(`Cannot deserialize value : plugin ${raw.__type} not found`);
    }
    return plugin.deserialize(raw.value);
  }

  const payload = {};
  for(const [ key, value ] of Object.entries(raw)) {
    payload[key] = deserialize(value);
  }
  return payload;
}
