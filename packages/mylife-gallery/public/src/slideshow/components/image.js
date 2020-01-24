'use strict';

import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';

const useStyles = mui.makeStyles({
  image: {
    objectFit: 'scale-down',
    width: '100%',
    height: '100%',
  },
});

const ImageContent = ({ url, className, ...props }) => {
  const classes = useStyles();
  return (
    <img src={url} className={clsx(classes.image, className)} {...props} />
  );
};

ImageContent.propTypes = {
  slideshow: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  className: PropTypes.string
};

const TRANSITION_TIMEOUT = 500;

const transitions = {
  none: { component: React.Fragment },
  collapse: { component: React.Fragment }, // TODO: does not work as-this { component: mui.Collapse, props: { in: true, timeout: TRANSITION_TIMEOUT } },
  fade: { component: mui.Fade, props: { in: true, timeout: TRANSITION_TIMEOUT } },
  grow: { component: mui.Grow, props: { in: true, timeout: TRANSITION_TIMEOUT } },
  slide: { component: mui.Slide, props: { in: true, direction: 'right', timeout: TRANSITION_TIMEOUT } },
  zoom: { component: mui.Zoom, props: { in: true, timeout: TRANSITION_TIMEOUT } },
};

const Image = ({ slideshow, url, className, ...props }) => {
  const classes = useStyles();

  const transitionData = transitions[slideshow.transition];
  if(!transitionData) {
    throw new Error(`Unknown transition: ${transitionData}`);
  }

  const { component: Transition, props: transitionProps } = transitionData;
  return (
    <Transition key={url} {...transitionProps}>
      <img src={url} className={clsx(classes.image, className)} {...props} />
    </Transition>
  );
};

Image.propTypes = {
  slideshow: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default Image;
