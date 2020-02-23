'use strict';

import { mui, useScreenSize, clsx } from 'mylife-tools-ui';

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
    overflowY: 'auto'
  },
  detailLarge: {
    width: 350,
  },
  detailSmall: {
    minWidth: '100%',
  }
});

export const useDetailClasses = () => {
  const classes = useCommonStyles();
  const screenSize = useScreenSize();

  switch(screenSize) {
    case 'phone':
      return clsx(classes.detail, classes.detailSmall);

    case 'tablet':
    case 'laptop':
    case 'wide':
      return clsx(classes.detail, classes.detailLarge);
  }
};
