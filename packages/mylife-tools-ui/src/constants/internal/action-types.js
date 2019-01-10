'use strict';

import { wrap } from '..';
import { STATE_PREFIX } from './defines';

export default wrap({
  
  // dialogs
  ERROR_CLEAR          : null,
  INFO_SHOW            : null,
  INFO_CLEAR           : null,
  NOTIFICATION_SHOW    : null,
  NOTIFICATION_DISMISS : null,
  NOTIFICATION_CLEAR   : null,

}, STATE_PREFIX);
