'use strict';

const proxyHandler = {
  get: (target, name) => {
    if(name in target) {
      return target[name];
    }
    throw new Error(`Invalid constant name: '${name}'`);
  }
};

export default function(target, ...prefixes) {
  const prefix = prefixes.length ? prefixes.join(':') + ':' : '';
  const obj = {};
  for(const [ key, value ] of Object.entries(target)) {
    const symbol = Symbol(prefix + (value || key));
    obj[key] = symbol;
  }
  Object.freeze(obj);
  return new Proxy(obj, proxyHandler);
}
