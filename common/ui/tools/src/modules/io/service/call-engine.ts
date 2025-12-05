import { defer, Deferred } from '../../../utils';
import { Engine, ServiceAPI } from '.';

const CALL_TIMEOUT = 5000;

const logger = import.meta.env.PROD ? () => {} : logCall;

const styles = {
  default: 'color: inherit; font-weight: bold',
  lighter: 'color: gray; font-weight: lighter',
  request: 'color: #03A9F4; font-weight: bold',
  result: 'color: #4CAF50; font-weight: bold',
  error: 'color: #F20404; font-weight: bold',
};

export interface ServiceCall {
  timeout?: number;
  service: string;
  method: string;
  [paramKey: string]: any;
}

interface CallRequest extends Omit<ServiceCall, 'timeout'> {
  engine: 'call';
  transaction: number;
}

interface CallResponse {
  engine: 'call';
  transaction: number;
  error?: Error;
  result?: unknown;
}

class Pending {
  private readonly timeout: number;
  private readonly begin = Date.now();
  private end: number | null = null;

  constructor(
    private readonly engine: CallEngine,
    private readonly request: CallRequest,
    private readonly deferred: Deferred<any>,
    timeout: number
  ) {
    this.timeout = setTimeout(() => this.onTimeout(), timeout);
  }

  get transaction() {
    return this.request.transaction;
  }

  private finish(error: Error, result?: unknown) {
    this.end = Date.now();
    clearTimeout(this.timeout);
    this.engine.removePending(this);

    if (!import.meta.env.PROD) {
      this.logger(error, result);
    }

    if (error) {
      this.deferred.reject(error);
    } else {
      this.deferred.resolve(result);
    }
  }

  private logger(error: Error, result?: unknown) {
    const duration = this.end! - this.begin;
    const { service, method } = this.request;
    /* eslint-disable no-console */
    console.groupCollapsed(`%c call %c${service}.${method} %c(in ${duration.toFixed(2)} ms)`, styles.lighter, styles.default, styles.lighter);
    console.log('%crequest', styles.request, this.request);
    if (error) {
      console.log('%cerror', styles.error, error);
    } else {
      console.log('%cresult', styles.result, result);
    }
    console.groupEnd();
    /* eslint-enable */
  }

  reply(message: CallResponse) {
    const { error, result } = message;
    this.finish(error, result);
  }

  onDisconnect() {
    this.finish(new Error('Disconnected while running query'));
  }

  onTimeout() {
    this.finish(new Error('Timeout while running query'));
  }
}

class CallEngine implements Engine {
  private readonly pendings = new Map<number, Pending>();
  private transactionCounter = 0;

  constructor(
    private readonly emitter: (message: CallRequest) => void,
    private readonly api: ServiceAPI
  ) {}

  onDisconnect() {
    const pendings = Array.from(this.pendings.values());
    for (const pending of pendings) {
      pending.onDisconnect();
    }
  }

  onConnect() {}

  onMessage(untypedMessage: unknown) {
    const message = untypedMessage as CallResponse;
    const { transaction } = message;
    const pending = this.pendings.get(transaction);
    if (!pending) {
      console.log(`Got response for unknown transaction '${transaction}', ignored`); // eslint-disable-line no-console
      return;
    }

    pending.reply(message);
  }

  addPending(pending: Pending) {
    this.pendings.set(pending.transaction, pending);
    if (this.pendings.size === 1) {
      this.api.setBusy(true);
    }
  }

  removePending(pending: Pending) {
    this.pendings.delete(pending.transaction);
    if (this.pendings.size === 0) {
      this.api.setBusy(false);
    }
  }

  async executeCall(message: ServiceCall) {
    const transaction = ++this.transactionCounter;
    const { timeout = CALL_TIMEOUT, ...props } = message;
    const request: CallRequest = { ...props, transaction, engine: 'call' };

    this.emitter(request);

    const deferred = defer();
    this.addPending(new Pending(this, request, deferred, timeout));

    return await deferred.promise;
  }
}

export default CallEngine;
