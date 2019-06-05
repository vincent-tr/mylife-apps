'use strict';

import wrap from '../../constants/wrapper';
import { STATE_PREFIX } from '../../constants/defines';

export default wrap({

  BUSY_SET             : null,
  ERROR_CLEAR          : null,
  NOTIFICATION_SHOW    : null,
  NOTIFICATION_DISMISS : null,
  NOTIFICATION_CLEAR   : null,

}, STATE_PREFIX);
