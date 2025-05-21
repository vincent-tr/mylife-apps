import { createLogger } from './logging';
import { registerService, getService } from './service-manager';
import { serializer } from 'mylife-tools-common';

const logger = createLogger('mylife:tools:server:io');

class IOSession {
  constructor(private readonly session, private readonly socket) {
    this.socket.on('error', (err) => this.onError(err));
    this.socket.on('disconnect', () => this.onDisconnect());
    this.socket.on('message', (raw) => this.onMessage(raw));
  }

  close() {
    this.socket.disconnect(true);
  }

  private onError(err) {
    logger.error(`Socket error on session #${this.session.id}: ${err.stack}`);
  }

  private async onDisconnect() {
    // TODO: or run on task queue ?
    const sessionManager = getService('session-manager');
    await sessionManager.closeSession(this.session);
  }

  private onMessage(raw) {
    // logger.debug(`Receive raw message on session #${this.session.id} => ${JSON.stringify(raw)}`);

    let message;
    try {
      message = serializer.deserialize(raw);
    } catch (err) {
      logger.error(`Bad raw message received on session #${this.session.id}: ${err.stack}`);
    }

    try {
      this.dispatch(message);
    } catch (err) {
      logger.error(`Unhandled error on message dispatch for session #${this.session.id}: ${err.stack}`);
    }
  }

  send(payload) {
    try {
      const raw = serializer.serialize(payload);
      // logger.debug(`Emit raw message on session #${this.session.id} => ${JSON.stringify(raw)}`);
      this.socket.emit('message', raw);
    } catch (err) {
      logger.error(`Cannot send message for session #${this.session.id}: ${err.stack}`);
    }
  }

  private dispatch(message) {
    if (message.engine !== 'call') {
      logger.debug(`Got message with engine === '${message.engine}', ignored`);
      return;
    }

    const apiRegistry = getService('api-registry');

    try {
      const method = apiRegistry.lookup(message.service, message.method);
      this.submitTask(`call/${method.service.name}/${method.name}`, async () => {
        try {
          const result = await method.call(this.session, message);
          this.send(createReply(message, { result }));
        } catch (err) {
          logger.error(`Service method error for session #${this.session.id}: ${err.stack}`);
          this.send(createErrorReply(message, err));
        }
      });
    } catch (err) {
      logger.error(`Dispatch error for session #${this.session.id}: ${err.stack}`);
      this.send(createErrorReply(message, err));
    }
  }

  submitTask(name, callback) {
    const taskQueue = getService('task-queue-manager').getQueue('io');
    taskQueue.add(name, callback);
  }

  notify(payload) {
    this.send({ engine: 'notify', ...payload });
  }
}

class IO {
  async init() {
    getService('task-queue-manager').createQueue('io');
  }

  async terminate() {
    await getService('task-queue-manager').closeQueue('io');
  }

  newSocket(socket) {
    const sessionManager = getService('session-manager');
    const session = sessionManager.newSession();
    session.io = session.registerClosable(new IOSession(session, socket));
  }

  getSessionIO(session) {
    return session.io;
  }

  static readonly serviceName = 'io';
  static readonly dependencies = ['api-registry', 'task-queue-manager', 'session-manager'];
}

registerService(IO);

function createReply(input, data = {}) {
  return {
    engine: 'call',
    transaction: input.transaction,
    ...data,
  };
}

function createErrorReply(input, err) {
  return createReply(input, { error: err });
}
