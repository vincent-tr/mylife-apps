export function defer<T>() {
	return new Deferred<T>();
};

class Deferred<T> {
  public promise: Promise<T>;

  private _resolve: (value: T) => void;
  private _reject: (reason: Error) => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  resolve(value: T) {
    this._resolve(value);
  }

  reject(reason: Error) {
    this._reject(reason);
  }
}
