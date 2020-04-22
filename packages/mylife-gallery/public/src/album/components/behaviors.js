'use strict';

import { useScreenSize } from 'mylife-tools-ui';

export function useIsSmallScreen() {
  const screenSize = useScreenSize();

  switch(screenSize) {
    case 'phone':
      return true;

    case 'tablet':
    case 'laptop':
    case 'wide':
      return false;
  }
}
