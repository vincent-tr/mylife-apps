'use strict';

import { utils } from 'mylife-tools-common';
import { busySet } from '../../dialogs';

const CALL_TIMEOUT = 5000;

const timer = (performance && typeof performance.now === 'function') ? performance : Date;
const logger = process.env.NODE_ENV === 'production' ? () => {} : logCall;

class Pending {
  constructor(engine, request, deferred) {
    this.engine = engine;
    this.request = request;
    this.deferred = deferred;
    this.timeout = setTimeout(() => this.onTimeout(), CALL_TIMEOUT);
    this.begin = timer.now();
  }

  get transaction() {
    return this.request.transaction;
  }

  finish(error, result) {
    this.end = timer.now();
    clearTimeout(this.timeout);
    this.engine.removePending(this);

    logger(this, error, result);

    if(error) {
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
  constructor(emitter, dispatch) {
    this.emitter = emitter;
    this.dispatch = dispatch;
    this.pendings = new Map();
    this.transactionCounter = 0;
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
    const request = { ...message, transaction, engine: 'call' };
    this.emitter(request);

    const deferred = utils.defer();
    this.addPending(new Pending(this, request, deferred));

    return await deferred.promise;
  }
}

export default CallEngine;

function logCall(pending, error, result) {
  const duration = pending.end - pending.begin;
  const { service, method } = pending.request;
  /* eslint-disable no-console */
  console.groupCollapsed(`CALL ${service}.${method} (in ${duration.toFixed(2)} ms)`);
  console.log('request', pending.request);
  if(error) {
    console.log('error', error);
  } else {
    console.log('result', result);
  }
  console.groupEnd();
  /* eslint-enable */
}
