interface Plugin {
  name: string;
  is: (payload: unknown) => boolean;
  serialize: (payload: any) => unknown;
  deserialize: (raw: any) => any;
}

const plugins: Plugin[] = [];
const pluginByNames = new Map<string, Plugin>();

export function addPlugin(plugin: Plugin) {
  plugins.push(plugin);
  pluginByNames.set(plugin.name, plugin);
}

interface RawValue {
  __type: string;
  value: unknown;
}

export function serialize(payload: unknown): unknown {
  if (typeof payload !== 'object' || payload === null) {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map((item: unknown) => serialize(item));
  }

  for (const plugin of plugins) {
    if (plugin.is(payload)) {
      const raw: RawValue = {
        __type: plugin.name,
        value: plugin.serialize(payload),
      };

      return raw;
    }
  }

  if (payload.constructor === {}.constructor) {
    const raw: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(payload)) {
      raw[key] = serialize(value);
    }
    return raw;
  }

  throw new Error(`Cannot serialize value : ${payload}`);
}

export function deserialize(raw: unknown): unknown {
  if (typeof raw !== 'object' || raw === null) {
    return raw;
  }

  if (Array.isArray(raw)) {
    return raw.map((item) => deserialize(item));
  }

  if ('__type' in raw) {
    const rawValue = raw as RawValue;
    const plugin = pluginByNames.get(rawValue.__type);
    if (!plugin) {
      throw new Error(`Cannot deserialize value : plugin ${rawValue.__type} not found`);
    }
    return plugin.deserialize(rawValue.value);
  }

  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    payload[key] = deserialize(value);
  }
  return payload;
}
