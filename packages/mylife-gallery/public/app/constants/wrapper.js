'use strict';

const proxyHandler = {
  get: (target, name) => {
    if(name in target) {
      return target[name];
    }
    throw new Error(`Invalid constant name: '${name}'`);
  }
};

export default function(target) {
  for(const key of Object.keys(target)) {
    target[key] = key;
  }
  Object.freeze(target);
  return new Proxy(target, proxyHandler);
}