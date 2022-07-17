import { registerService } from 'mylife-tools-server';
import * as business from './business';

class IndexService {
  async init() {
    business.documentIndexesInit();
  }

  async terminate() {
    business.documentIndexesTerminate();
  }

  static readonly serviceName = 'index-service';
  static readonly dependencies = ['store'];
}

registerService(IndexService);
