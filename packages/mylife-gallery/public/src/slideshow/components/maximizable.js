'use strict';

import { React, PropTypes, mui, clsx, useState, useLayoutEffect, useEffect } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => ({
  enterButton: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

const Maximizable = ({ classes: propClasses = {}, className, children, ...props }) => {
  const classes = useStyles();
  const maximizableElement = React.useRef();
  const [isFullscreen, setFullscreen] = useFullscreenStatus(maximizableElement);

  useEffect(() => setFullscreen(true), []);

  return (
    <div ref={maximizableElement} className={clsx(isFullscreen ? propClasses.fullscreen : propClasses.windowed, className)} {...props}>
      {children}
      {!isFullscreen && (
        <mui.Fab color='primary' onClick={() => setFullscreen(true)} className={classes.enterButton}>
          <mui.icons.Fullscreen />
        </mui.Fab>
      )}
    </div>
  );
};

Maximizable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

export default Maximizable;

function useFullscreenStatus(elRef) {
  const [isFullscreen, setIsFullscreen] = useState(isBrowserFullScreen());

  const setFullscreen = (value) => {
    if(!value) {
      document.exitFullscreen();
      return;
    }

    if (!elRef.current) {
      return;
    }

    elRef.current.requestFullscreen();
  };

  useLayoutEffect(() => {
    const handler = () => setIsFullscreen(isBrowserFullScreen());
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  });

  return [isFullscreen, setFullscreen];
}

function isBrowserFullScreen() {
  return getBrowserFullscreenElement() !== null;
}

function getBrowserFullscreenElement() {
  if (typeof document.fullscreenElement !== 'undefined') {
    return document.fullscreenElement;
  } else if (typeof document.mozFullScreenElement !== 'undefined') {
    return document.mozFullScreenElement;
  } else if (typeof document.msFullscreenElement !== 'undefined') {
    return document.msFullscreenElement;
  } else if (typeof document.webkitFullscreenElement !== 'undefined') {
    return document.webkitFullscreenElement;
  } else {
    throw new Error('fullscreenElement is not supported by this browser');
  }
}
