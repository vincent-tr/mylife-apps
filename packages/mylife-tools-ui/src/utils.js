'use strict';

export function fireAsync(target) {
  target().catch(err => console.error('Unhandled promise rejection', err)); // eslint-disable-line no-console
}
