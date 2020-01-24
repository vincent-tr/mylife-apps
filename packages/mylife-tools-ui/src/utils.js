'use strict';

export function fireAsync(target) {
  target().catch(err => console.error('Unhandled promise rejection', err)); // eslint-disable-line no-console
}

export class AbortError extends Error {
}

// throws AbortError if aborted
export async function abortableDelay(delay, controller) {
  return new Promise((resolve, reject) => {
    const signal = controller.signal;
    let timer;

    const abortHandler = () => {
      clearTimeout(timer);
      signal.removeEventListener('abort', abortHandler);
      reject(new AbortError());
    };

    signal.addEventListener('abort', abortHandler);

    timer = setTimeout(() => {
      signal.removeEventListener('abort', abortHandler);
      resolve();
    }, delay);
  });
}
