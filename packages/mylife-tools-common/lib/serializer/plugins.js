'use strict';

const { addPlugin } = require('./engine');

addPlugin({
  name: 'error',
  is: payload => payload instanceof Error,
  serialize: payload => ({
    message : payload.message,
    stacktrace: payload.stacktrace
  }),
  deserialize: raw => {
    const err = new Error(raw.message);
    err.remoteStacktrace = raw.stacktrace;
    return err;
  }
});

addPlugin({
  name: 'date',
  is: payload => payload instanceof Date,
  serialize: payload => payload.valueOf(),
  deserialize: raw => new Date(raw)
});
