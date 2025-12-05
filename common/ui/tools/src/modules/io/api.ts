import { viewChange } from '../views/store';
import { ServiceCall } from './service/call-engine';
import { Service, ServiceAPI, ViewChange } from './service';
import { setOnline, setBusy } from './store';
export type { ServiceCall } from './service/call-engine';
import type { ToolsDispatch } from '../../services/store-api';

class ServiceApiImpl implements ServiceAPI {
  private dispatch: ToolsDispatch | null = null;

  setOnline(online: boolean): void {
    if (this.dispatch) {
      this.dispatch(setOnline(online));
    } else {
      console.error('ServiceApiImpl: dispatch not set, cannot set online status');
    }
  }

  setBusy(busy: boolean): void {
    if (this.dispatch) {
      this.dispatch(setBusy(busy));
    } else {
      console.error('ServiceApiImpl: dispatch not set, cannot set busy status');
    }
  }

  viewChange(changes: ViewChange): void {
    if (this.dispatch) {
      this.dispatch(viewChange(changes));
    } else {
      console.error('ServiceApiImpl: dispatch not set, cannot dispatch view change');
    }
  }

  connectStoreDispatcher(dispatch: ToolsDispatch) {
    this.dispatch = dispatch;
  }
}

const serviceApi = new ServiceApiImpl();
const service = new Service(serviceApi);

export async function call(message: ServiceCall) {
  return await service.executeCall(message);
}

export function connectStoreDispatcher(dispatch: ToolsDispatch) {
  serviceApi.connectStoreDispatcher(dispatch);
}
