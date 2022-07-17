import { createLogger } from './logging';
import { registerService } from './service-manager';

const logger = createLogger('mylife:tools:server:session-manager');

class Session {
  private onTerminate: (() => void)[] = [];

  constructor(public readonly id: number) {
  }

  registerTerminateCallback(cb: () => void) {
    this.onTerminate.push(cb);
    return cb;
  }

  registerClosable(obj) {
    this.onTerminate.push(() => obj.close());
    return obj;
  }

  async terminate() {
    for(const cb of this.onTerminate) {
      try {
        await cb();
      } catch(err) {
        logger.error(`Error while closing session ${this.id}: ${err.stack}`);
      }
    }

    this.onTerminate = null;
  }
}

class SessionManager {
  private readonly sessions = new Map();
  private idGenerator = 0;

  async init() {
  }

  async terminate() {
  }

  newSession() {
    const id = ++this.idGenerator;
    const session = new Session(id);
    this.sessions.set(session.id, session);
    logger.debug(`New session #${session.id}`);
    return session;
  }

  async closeSession(session) {
    const { id } = session;
    this.sessions.delete(id);
    await session.terminate();
    logger.debug(`Session #${id} closed`);
  }

  static readonly serviceName = 'session-manager';
}

registerService(SessionManager);
