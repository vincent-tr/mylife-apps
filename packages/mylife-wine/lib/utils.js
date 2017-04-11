'use strict';

module.exports.asyncToPromise = (func) => {
  return (...args) => {
    return new Promise((accept, reject) => {
      func(...args, (err, res) => {
        if(err) { return reject(err); }
        return accept(res);
      });
    });
  };
};