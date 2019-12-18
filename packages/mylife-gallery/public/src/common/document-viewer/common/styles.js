'use strict';

import { mui } from 'mylife-tools-ui';

export const useCommonStyles = mui.makeStyles({
  appBar: {
    position: 'relative',
  },
  viewerContainer: {
    display: 'flex'
  },
  viewer: {
    flex: 1,
  },
  detail: {
    width: 200
  }
});
