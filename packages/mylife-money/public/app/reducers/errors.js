'use strict';

export default function(state = null, action) {
  if(action.error) {
    return action.payload;
  }
  return state;
}
