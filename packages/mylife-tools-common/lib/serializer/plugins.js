'use strict';

const { addPlugin } = require('./engine');
const isNode = typeof process !== 'undefined';

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

addPlugin({
  name: 'buffer',
  is: payload => payload instanceof Uint8Array,
  serialize: isNode ? (payload => payload.toString('base64')) : serializeBuffer,
  deserialize: isNode ? (raw => Buffer.from(raw, 'base64')) : deserializeBuffer
})

function serializeBuffer(buffer) {
  // https://github.com/github-tools/github/issues/137
  const chunksize = 0xffff;
  const strings = [];
  const len = buffer.length;

  // There is a maximum stack size. We cannot call String.fromCharCode with as many arguments as we want
  for (let i = 0; i * chunksize < len; ++i) {
    const sarr = buffer.subarray(i * chunksize, (i + 1) * chunksize);
    strings.push(String.fromCharCode.apply(null, sarr));
  }

  return btoa(strings.join(''));
}

function deserializeBuffer(buffer) {
  // https://gist.github.com/borismus/1032746
  const raw = atob(buffer);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for(let i = 0; i < rawLength; ++i) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}
