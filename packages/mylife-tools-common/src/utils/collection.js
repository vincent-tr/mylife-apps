'use strict'


exports.objectMapValues = (obj, mapper) => {
  const result = {};
  for(const [key, value] of Object.entries(obj)) {
    result[key] = mapper(value, key);
  }
  return result;
};


exports.indexBy = (array, prop) => {
  const result = {};
  for(const item of array) {
    result[item[prop]] = item;
  }
  return result;
};
