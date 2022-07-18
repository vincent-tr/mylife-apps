'use strict';

import { React, PropTypes, mui, clsx, useState, useEffect, fireAsync, AbortError, abortableDelay } from 'mylife-tools-ui';

const useStyles = mui.makeStyles({
  image: {
    objectFit: 'scale-down',
    width: '100%',
    height: '100%',
  },
});

const TRANSITION_TIMEOUT = 500;

const ImageContent = React.forwardRef(({ url, className, ...props }, ref) => {
  const classes = useStyles();
  return (
    <img ref={ref} src={url} className={clsx(classes.image, className)} {...props} />
  );
});

ImageContent.displayName = 'ImageContent';

ImageContent.propTypes = {
  url: PropTypes.string.isRequired,
  className: PropTypes.string
};

const NoTransition = ({ transitionData, ...props }) => {
  void transitionData;
  return (
    <ImageContent {...props} />
  );
};

NoTransition.propTypes = {
  transitionData: PropTypes.object.isRequired
};

const Transition = ({ transitionData, url, ...props }) => {
  const { transitionIn, stateUrl } = useTransition(url);
  const { component: Transition } = transitionData;
  return (
    <Transition in={transitionIn} timeout={TRANSITION_TIMEOUT}>
      <ImageContent url={stateUrl} {...props} />
    </Transition>
  );
};

Transition.propTypes = {
  url: PropTypes.string.isRequired,
  transitionData: PropTypes.object.isRequired
};

const LeftRightSlide = ({ in: inProp, ...props }) => (
  <mui.Slide in={inProp} direction={inProp ? 'right' : 'left'} {...props} />
);

LeftRightSlide.propTypes = {
  in: PropTypes.bool.isRequired
};

const transitions = {
  none: { wrapper: NoTransition },
  fade: { wrapper: Transition, component: mui.Fade },
  grow: {  wrapper: Transition, component: mui.Grow },
  slide: {  wrapper: Transition, component: LeftRightSlide },
  zoom: {  wrapper: Transition, component: mui.Zoom },
};

const Image = ({ slideshow, ...props }) => {
  const transitionData = transitions[slideshow.transition];
  if(!transitionData) {
    throw new Error(`Unknown transition: ${transitionData}`);
  }

  const { wrapper: Wrapper } = transitionData;
  return (
    <Wrapper transitionData={transitionData} {...props} />
  );
};

Image.propTypes = {
  url: PropTypes.string.isRequired,
  slideshow: PropTypes.object.isRequired,
};

export default Image;

function useTransition(url) {
  const [transitionIn, setTransitionIn] = useState(true);
  const [stateUrl, setStateUrl] = useState(url);

  useEffect(() => {
    // on init set directly
    if(!stateUrl) {
      setStateUrl(url);
      setTransitionIn(true);
      return;
    }

    const controller = new AbortController();
    fireAsync(async () => {
      try {

        // transition switch
        setTransitionIn(false);
        await abortableDelay(TRANSITION_TIMEOUT, controller);
        setStateUrl(url);
        await abortableDelay(10, controller);
        setTransitionIn(true);

      } catch(err) {
        if(err instanceof AbortError) {
          // aborted
          return;
        }

        throw err;
      }
    });

    return () => {
      controller.abort();
    };
  }, [url]);

  return { transitionIn, stateUrl };
}
