import { api } from 'mylife-tools';
import { Group } from '..';

export class Management extends api.services.Service {
  async createGroup(newGroup: Partial<Group>) {
    return (await this.call({
      service: 'management',
      method: 'createGroup',
      object: newGroup,
    })) as string;
  }

  async deleteGroup(id: string) {
    await this.call({
      service: 'management',
      method: 'deleteGroup',
      id,
    });
  }

  async updateGroup(group: Group) {
    await this.call({
      service: 'management',
      method: 'updateGroup',
      object: group,
    });
  }

  async moveOperations({ group, operations }: { group: string; operations: string[] }) {
    await this.call({
      service: 'management',
      method: 'moveOperations',
      group,
      operations,
    });
  }

  async operationsSetNote({ note, operations }: { note: string; operations: string[] }) {
    await this.call({
      service: 'management',
      method: 'operationsSetNote',
      note,
      operations,
    });
  }

  async operationsImport({ account, content }: { account: string; content: string }) {
    return (await this.call({
      service: 'management',
      method: 'operationsImport',
      account,
      content,
    })) as number;
  }

  async operationsExecuteRules() {
    return (await this.call({
      service: 'management',
      method: 'operationsExecuteRules',
    })) as number;
  }
}
