import { addPlugin } from './engine';

class RemoteError extends Error {
  constructor(
    message: string,
    public readonly stacktrace: string
  ) {
    super(message);
  }
}

interface ErrorWithStacktrace extends Error {
  stacktrace: string;
}

addPlugin({
  name: 'error',
  is: (payload: unknown) => payload instanceof Error,
  serialize: (payload: ErrorWithStacktrace) => ({
    message: payload.message,
    stacktrace: payload.stacktrace,
  }),
  deserialize: (raw: { message: string; stacktrace: string }) => {
    return new RemoteError(raw.message, raw.stacktrace);
  },
});

addPlugin({
  name: 'date',
  is: (payload: unknown) => payload instanceof Date,
  serialize: (payload: Date) => payload.valueOf(),
  deserialize: (raw: number) => new Date(raw),
});

addPlugin({
  name: 'buffer',
  is: (payload: unknown) => payload instanceof Uint8Array,
  serialize: serializeBuffer,
  deserialize: deserializeBuffer,
});

function serializeBuffer(buffer: Uint8Array) {
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

function deserializeBuffer(buffer: string) {
  // https://gist.github.com/borismus/1032746
  const raw = atob(buffer);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; ++i) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}
