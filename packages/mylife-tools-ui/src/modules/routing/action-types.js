'use strict';

import wrap from '../../constants/wrapper';
import { STATE_PREFIX } from '../../constants/defines';

export default wrap({

  LOCATION_CHANGE     : null,
  CALL_HISTORY_METHOD : null,

}, STATE_PREFIX, 'routing');
