'use strict';

import wrap from '../../constants/wrapper';
import { STATE_PREFIX } from '../../constants/defines';

export default wrap({

  SET_ONLINE : null,
  CALL : null,
  VIEW_SET : null,
  VIEW_UNSET : null,
  VIEW_CLOSE : null

}, STATE_PREFIX, 'io');
