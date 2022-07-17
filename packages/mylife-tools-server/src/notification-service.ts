import { registerService, getService } from './service-manager';
import { createLogger } from './logging';

const logger = createLogger('mylife:tools:server:notification-service');

class SessionNotifications {
  private readonly views = new Map();
  private idGenerator = 0;
  private readonly pendingNotifications = new Map();

  constructor(private readonly session) {}

  close() {
    for (const viewId of Array.from(this.views.keys())) {
      this.closeView(viewId);
    }
  }

  private notify({ view, ...payload }) {
    let pendings = this.pendingNotifications.get(view);
    const created = !pendings;
    if (!pendings) {
      pendings = [];
    }

    pendings.push(payload);

    if (created) {
      this.pendingNotifications.set(view, pendings);
      const ioSession = getService('io').getSessionIO(this.session);
      ioSession.submitTask(`notify/${view}`, async () => {
        this.pendingNotifications.delete(view);
        ioSession.notify({ view, list: pendings });
      });
    }
  }

  private newId() {
    return ++this.idGenerator;
  }

  private onViewChange(viewId, { before, after, type }) {
    switch (type) {
      case 'create':
      case 'update':
        this.notify({ view: viewId, type: 'set', object: after });
        break;

      case 'remove':
        this.notify({ view: viewId, type: 'unset', objectId: before._id });
        break;

      default:
        throw new Error(`Unsupported event type: '${type}'`);
    }
  }

  registerView(view) {
    const id = this.newId();
    this.views.set(id, view);
    view.refresh();

    view.on('change', (event) => this.onViewChange(id, event));

    logger.debug(`View #${id} registered on session #${this.session.id}`);

    // emit all events
    for (const object of view.list()) {
      this.notify({ view: id, type: 'set', object });
    }

    return id;
  }

  closeView(viewId) {
    const view = this.views.get(viewId);
    if (!view) {
      throw new Error(`Cannot remove unknown view #${viewId} from session #${this.session.id}`);
    }
    view.removeAllListeners();
    this.views.delete(viewId);
    view.close();

    logger.debug(`View #${viewId} unregistered from session #${this.session.id}`);
  }

  getView(viewId) {
    const view = this.views.get(viewId);
    if (!view) {
      throw new Error(`Cannot get unknown view #${viewId} from session #${this.session.id}`);
    }
    return view;
  }
}

function getNotifications(session) {
  if (!session.notifications) {
    session.notifications = session.registerClosable(new SessionNotifications(session));
  }
  return session.notifications;
}

class NotificationService {
  async init() {}

  async terminate() {}

  registerView(session, view) {
    return getNotifications(session).registerView(view);
  }

  closeView(session, viewId) {
    getNotifications(session).closeView(viewId);
  }

  getView(session, viewId) {
    return getNotifications(session).getView(viewId);
  }

  static readonly serviceName = 'notification-service';
  static readonly dependencies = ['session-manager', 'io'];
}

registerService(NotificationService);

export function notifyView(session, view) {
  return getService('notification-service').registerView(session, view);
}

export function unnotifyView(session, viewId) {
  getService('notification-service').closeView(session, viewId);
}

export function getNotifiedView(session, viewId) {
  return getService('notification-service').getView(session, viewId);
}
