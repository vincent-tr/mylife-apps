import wrap from '../../constants/wrapper';
import { STATE_PREFIX } from '../../constants/defines';

export default wrap({

  SET_VIEW: null,
  REF: null,
  UNREF: null

}, STATE_PREFIX, 'views');

export interface SetViewPayload {
  uid: string;
  viewId: string;
}

export type RefPayload = string;
export type UnrefPayload = string;
