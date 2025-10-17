'use strict';

import useMediaQuery from '@material-ui/core/useMediaQuery';

// https://gist.github.com/gokulkrishh/242e68d1ee94ad05f488
export const useScreenPhone = () => useMediaQuery('(max-width: 767px)');
export const useScreenTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
export const useScreenLaptop = () => useMediaQuery('(min-width: 1025px) and (max-width: 1440px)');
export const useScreenWide = () => useMediaQuery('(min-width: 1441px)');
export const useScreenLandscape = () => useMediaQuery('(orientation: landscape)');
export const useScreenPortrait = () => useMediaQuery('(orientation: portrait)');

export function useScreenSize() {
  const isPhone = useScreenPhone();
  const isTablet = useScreenTablet();
  const isLaptop = useScreenLaptop();

  if(isPhone) {
    return 'phone';
  }
  if(isTablet) {
    return 'tablet';
  }
  return isLaptop ? 'laptop' : 'wide';
}

export function useScreenOrientation() {
  return useScreenLandscape() ? 'landscape' : 'portrait';
}

export function useScreen() {
  return {
    size: useScreenSize(),
    orientation: useScreenOrientation()
  };
}
