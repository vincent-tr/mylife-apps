export class AbortError extends Error {}

// throws AbortError if aborted
export async function abortableDelay(delay: number, signal: AbortSignal) {
  await new Promise<void>((resolve, reject) => {
    const abortHandler = () => {
      clearTimeout(timer);
      signal.removeEventListener('abort', abortHandler);
      reject(new AbortError());
    };

    signal.addEventListener('abort', abortHandler);

    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abortHandler);
      resolve();
    }, delay);
  });
}

export function fireAsync(target) {
  target().catch((err) => console.error('Unhandled promise rejection', err)); // eslint-disable-line no-console
}

export interface Deferred<T> {
  readonly promise: Promise<T>;
  resolve(value: T): void;
  reject(reason: Error): void;
}

export function defer<T>(): Deferred<T> {
  return new DeferredImpl<T>();
}

class DeferredImpl<T> implements Deferred<T> {
  public readonly promise: Promise<T>;

  private resolveImpl: (value: T) => void;
  private rejectImpl: (reason: Error) => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolveImpl = resolve;
      this.rejectImpl = reject;
    });
  }

  resolve(value: T) {
    this.resolveImpl(value);
  }

  reject(reason: Error) {
    this.rejectImpl(reason);
  }
}
