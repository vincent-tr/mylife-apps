'use strict';

import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';
import OrientedImage from '../../oriented-image';

const useStyles = mui.makeStyles(theme => ({
  container : {
    backgroundColor : theme.palette.background,
  },
  image : {
    position  : 'relative',
    height    : '100%',
    width     : '100%',
    objectFit : 'scale-down',
  }
}));

const ImageViewer = ({ info, className, ...props }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.container, className)} {...props}>
      <OrientedImage src={info.contentUrl} className={classes.image} />
    </div>
  );
};

ImageViewer.propTypes = {
  info: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default ImageViewer;
