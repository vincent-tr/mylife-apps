import { ServiceCall } from '../../modules/io/service/call-engine';

export type Call = (message: ServiceCall) => Promise<unknown>;

export class Service {
  constructor(protected readonly call: Call) {}
}
