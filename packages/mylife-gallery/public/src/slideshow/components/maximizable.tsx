'use strict';

import { React, PropTypes, mui, clsx, useState, useLayoutEffect, useEffect } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => ({
  enterButton: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

interface MaximizableProps {
  className?: string;
  classes?: { 
    fullscreen?: string;
    windowed?: string;
  };
}

const Maximizable: React.FunctionComponent<MaximizableProps> = ({ classes: propClasses = {}, className, children, ...props }) => {
  const classes = useStyles();
  const maximizableElement = React.useRef<HTMLDivElement>();
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
  // children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

export default Maximizable;

function useFullscreenStatus(elRef: React.MutableRefObject<HTMLDivElement>): [boolean, (value: boolean) => void] {
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
  const exoticDocument = document as any;

  if (typeof document.fullscreenElement !== 'undefined') {
    return document.fullscreenElement;
  } else if (typeof exoticDocument.mozFullScreenElement !== 'undefined') {
    return exoticDocument.mozFullScreenElement as Element;
  } else if (typeof exoticDocument.msFullscreenElement !== 'undefined') {
    return exoticDocument.msFullscreenElement as Element;
  } else if (typeof exoticDocument.webkitFullscreenElement !== 'undefined') {
    return exoticDocument.webkitFullscreenElement as Element;
  } else {
    throw new Error('fullscreenElement is not supported by this browser');
  }
}
