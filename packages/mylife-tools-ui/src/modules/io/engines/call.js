'use strict';

import { utils } from 'mylife-tools-common';

const CALL_TIMEOUT = 5000;

class Pending {
  constructor(engine, transaction, deferred) {
    this.engine = engine;
    this.transaction = transaction;
    this.deferred = deferred;
    this.timeout = setTimeout(() => this.onTimeout(), CALL_TIMEOUT);
  }

  finish(error, result) {
    clearTimeout(this.timeout);
    this.engine.pendings.delete(this.transaction);
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
      console.log('Got response for unknown transaction, ignored');
      return;
    }

    pending.reply(message);
  }

  async executeCall(message) {
    const transaction = ++this.transactionCounter;
    this.emitter({ ...message, transaction });

    const deferred = utils.defer();
    this.pendings.set(transaction, new Pending(this, transaction, deferred));

    return await deferred.promise;
  }
}

export default CallEngine;
