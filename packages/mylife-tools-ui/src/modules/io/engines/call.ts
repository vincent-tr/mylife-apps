import { utils } from 'mylife-tools-common';
import { busySet } from '../../dialogs';

const CALL_TIMEOUT = 5000;

const timer = (performance && typeof performance.now === 'function') ? performance : Date;
const logger = process.env.NODE_ENV === 'production' ? () => {} : logCall;

class Pending {
  private readonly timeout: NodeJS.Timeout;
  private readonly begin: number;
  private end: number;

  constructor(private readonly engine, private readonly request, private readonly deferred, timeout: number) {
    this.timeout = setTimeout(() => this.onTimeout(), timeout);
    this.begin = timer.now();
  }

  get transaction() {
    return this.request.transaction;
  }

  private finish(error, result?) {
    this.end = timer.now();
    clearTimeout(this.timeout);
    this.engine.removePending(this);

    logger(this, error, result);

    if (error) {
      this.deferred.reject(error);
    } else {
      this.deferred.resolve(result);
    }
  }

  reply(message) {
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

class CallEngine {
  private readonly pendings = new Map();
  private transactionCounter = 0;

  constructor(private readonly emitter, private readonly dispatch) {
  }

  onDisconnect() {
    const pendings = Array.from(this.pendings.values());
    for(const pending of pendings) {
      pending.onDisconnect();
    }
  }

  onConnect() {
  }

  onMessage(message) {
    const { transaction } = message;
    const pending = this.pendings.get(transaction);
    if(!pending) {
      console.log('Got response for unknown transaction, ignored'); // eslint-disable-line no-console
      return;
    }

    pending.reply(message);
  }

  addPending(pending) {
    this.pendings.set(pending.transaction, pending);
    if(this.pendings.size === 1) {
      this.dispatch(busySet(true));
    }
  }

  removePending(pending) {
    this.pendings.delete(pending.transaction);
    if(this.pendings.size === 0) {
      this.dispatch(busySet(false));
    }
  }

  async executeCall(message) {
    const transaction = ++this.transactionCounter;
    const { timeout = CALL_TIMEOUT, ...props } = message;
    const request = { ...props, transaction, engine: 'call' };

    this.emitter(request);

    const deferred = utils.defer();
    this.addPending(new Pending(this, request, deferred, timeout));

    return await deferred.promise;
  }
}

export default CallEngine;

const styles = {
  default: 'color: inherit; font-weight: bold',
  lighter: 'color: gray; font-weight: lighter',
  request: 'color: #03A9F4; font-weight: bold',
  result: 'color: #4CAF50; font-weight: bold',
  error: 'color: #F20404; font-weight: bold',
};

function logCall(pending, error, result) {
  const duration = pending.end - pending.begin;
  const { service, method } = pending.request;
  /* eslint-disable no-console */
  console.groupCollapsed(`%c call %c${service}.${method} %c(in ${duration.toFixed(2)} ms)`, styles.lighter, styles.default, styles.lighter);
  console.log('%crequest', styles.request, pending.request);
  if(error) {
    console.log('%cerror', styles.error, error);
  } else {
    console.log('%cresult', styles.result, result);
  }
  console.groupEnd();
  /* eslint-enable */
}
