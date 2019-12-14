'use strict';

import { React, PropTypes, clsx } from 'mylife-tools-ui';
import { getThumbnailUrl, useCommonStyles } from './utils';
import icons from '../icons';

// TODO
const ThumbnailVideo = ({ document, className, ...props }) => {
  void document, getThumbnailUrl;
  const classes = useCommonStyles();
  return (
    <div className={clsx(classes.container, className)} {...props}>
      <icons.documents.None className={classes.imageFallback} />
    </div>
  );
};

ThumbnailVideo.propTypes = {
  document: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default ThumbnailVideo;
