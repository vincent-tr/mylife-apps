'use strict';

import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';
import icons from '../icons';

const useStyles = mui.makeStyles({
  container: {
    height: 200,
    width: 200
  },
  imageFallback: {
    height: '100%',
    width: '100%'
  }
});

// TODO
const ThumbnailVideo = ({ document, className, ...props }) => {
  void document;
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
