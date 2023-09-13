import { FsListTask } from './fs-list-task';

export interface Task {
  runStep(): Promise<boolean>;
  createNextTask(): Task;
}

export class ManagerTask {
  private current: Task = new FsListTask();

  async runStep() {
    const shouldContinue = await this.current.runStep();
    if(shouldContinue) {
      return true;
    }

    this.current = this.current.createNextTask();
    return !!this.current;
  }
};
