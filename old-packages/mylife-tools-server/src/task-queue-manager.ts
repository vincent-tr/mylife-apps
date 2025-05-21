import { createLogger } from './logging';
import { registerService } from './service-manager';

const logger = createLogger('mylife:tools:server:task-queue');

class Timer {
  private readonly begin = process.hrtime();

  elapsed() {
    const diff = process.hrtime(this.begin);
    return diff[0] * 1e3 + diff[1] / 1e6;
  }
}

interface Task {
  name: string;
  func: () => void | Promise<void>;
  next: Task;
}

class TaskQueue {
  private head: Task = null;
  private tail: Task = null;
  private closing = false;
  private closed = false;
  private running = false;
  private readonly pendingEmptyCbs = new Set<() => void>();

  constructor(public readonly id: string) {}

  async close() {
    this.closing = true;
    await this.waitEmpty();
    this.closing = false;

    this.closed = true;
  }

  async waitEmpty() {
    if (!this.running) {
      return;
    }

    return new Promise<void>((resolve) => {
      this.pendingEmptyCbs.add(resolve);
    });
  }

  add(name: string, func: () => void | Promise<void>) {
    if (this.closing || this.closed) {
      throw new Error(`Cannot add tasks while closing on queue '${this.id}'`);
    }

    const task: Task = { name, func, next: null };

    if (this.tail) {
      this.tail.next = task;
      this.tail = task;
    } else {
      this.head = this.tail = task;
    }

    if (!this.running) {
      this.startNext();
    }
  }

  private startNext() {
    this.running = true;

    const task = this.head;
    this.head = task.next;
    if (!this.head) {
      this.tail = null;
    }
    task.next = null;

    // no catch, already done in runOne
    this.runOne(task).then(() => {
      if (this.head) {
        this.startNext();
        return;
      }

      this.running = false;
      for (const emptyCb of this.pendingEmptyCbs) {
        emptyCb();
      }
      this.pendingEmptyCbs.clear();
    });
  }

  private async runOne(task) {
    try {
      logger.debug(`Queue '${this.id}' : Task begin : ${task.name}`);

      const timer = new Timer();
      await task.func();
      const elapsed = timer.elapsed();

      logger.debug(`Queue '${this.id}' : Task end : ${task.name} (elapsed : ${elapsed.toFixed(2)}ms)`);
    } catch (err) {
      logger.error(`Queue '${this.id}' : Task error on ${task.name}: ${err.stack}`);
    }
  }
}

class TaskQueueManager {
  private readonly queues = new Map<string, TaskQueue>();

  async init() {}

  async terminate() {
    for (const id of Array.from(this.queues.keys())) {
      await this.closeQueue(id);
    }
  }

  createQueue(id: string) {
    if (this.queues.get(id)) {
      throw new Error(`Cannot create queue ${id}: already exists`);
    }

    const queue = new TaskQueue(id);
    this.queues.set(id, queue);
    return queue;
  }

  async closeQueue(id) {
    const queue = this.queues.get(id);
    if (!queue) {
      throw new Error(`Cannot close queue ${id}: does not exists`);
    }

    await queue.close();
    this.queues.delete(id);
  }

  getQueue(id) {
    const queue = this.queues.get(id);
    if (!queue) {
      throw new Error(`Cannot get queue ${id}: does not exists`);
    }

    return queue;
  }

  static readonly serviceName = 'task-queue-manager';
}

registerService(TaskQueueManager);
