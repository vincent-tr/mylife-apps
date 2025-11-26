export function defer<T>() {
  return new Deferred<T>();
}

class Deferred<T> {
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
