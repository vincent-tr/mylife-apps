import { STATE_PREFIX } from '../constants/defines';

export function getInternalState(state) {
  return state[STATE_PREFIX];
}
