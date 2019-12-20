'use strict';

import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => ({
  container : {
    backgroundColor : theme.palette.background,
    position: 'relative'
  },
  video : {
    position  : 'relative',
    height    : '100%',
    width     : '100%',
    objectFit : 'scale-down',
  }
}));

const VideoViewer = ({ info, className, ...props }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.container, className)} {...props}>
      <video controls playsinline
        src={info.contentUrl}
        className={classes.video} />
    </div>
  );
};

VideoViewer.propTypes = {
  info: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default VideoViewer;
