import { ServiceCall } from '../../modules/io/service/call-engine';

export type Call = (message: ServiceCall) => Promise<any>;

export class Service {
  constructor(protected readonly call: Call) {}
}
