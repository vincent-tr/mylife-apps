'use strict';

import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';
import { getThumbnailUrl, SIZE } from './utils';
import icons from '../icons';

const useStyles = mui.makeStyles({
  container: {
    height: SIZE,
    width: SIZE
  },
  imageFallback: {
    height: '100%',
    width: '100%'
  }
});

// TODO
const ThumbnailVideo = ({ document, className, ...props }) => {
  void document, getThumbnailUrl;
  const classes = useStyles();
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
