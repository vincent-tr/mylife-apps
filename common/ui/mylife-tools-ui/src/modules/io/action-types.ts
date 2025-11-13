import wrap from '../../constants/wrapper';
import { STATE_PREFIX } from '../../constants/defines';

export default wrap({

  SET_ONLINE : null,
  CALL : null,
  VIEW_CHANGE : null,
  VIEW_CLOSE : null

}, STATE_PREFIX, 'io');

type FIXME_any = any;

export type SetOnlinePayload = boolean;

export interface CallPayload {
  service: string;
  method: string;
  [key: string]: FIXME_any;
}

export interface ViewChangePayload {
  viewId: string;
  list: FIXME_any;
}

export interface ViewClosePayload {
  viewId: string;
}