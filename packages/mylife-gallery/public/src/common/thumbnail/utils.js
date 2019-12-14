'use strict';

import { mui } from 'mylife-tools-ui';

export const SIZE = 200;

export function getThumbnailUrl(id) {
  return `/content/thumbnail/${id}`;
}

export const useCommonStyles = mui.makeStyles({
  container: {
    height: SIZE,
    width: SIZE
  },
  imageLoading: {
    display: 'none'
  },
  imageFallback: {
    height: '100%',
    width: '100%',
    color: mui.colors.grey[200]
  }
});
