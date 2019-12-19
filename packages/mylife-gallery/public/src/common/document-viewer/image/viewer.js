'use strict';

import { React, PropTypes, mui, clsx, useState, useEffect } from 'mylife-tools-ui';
import icons from '../../icons';

const useStyles = mui.makeStyles(theme => ({
  container : {
    backgroundColor : theme.palette.background,
    position: 'relative'
  },
  image : {
    position  : 'relative',
    height    : '100%',
    width     : '100%',
    objectFit : 'scale-down',
  },
  imageLoading: {
    display: 'none'
  },
  imageFallback: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    margin: 'auto',
    height: '200px',
    width: '200px',
    color: mui.colors.grey[200]
  }
}));

const ImageViewer = ({ info, className, ...props }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  // onLoadStart not fired on chrome
  useEffect(() => setLoading(true), [info.contentUrl]);

  return (
    <div className={clsx(classes.container, className)} {...props}>
      <img
        src={info.contentUrl}
        onLoad={() => setLoading(false)}
        className={clsx(classes.image, { [classes.imageLoading]: loading })} />
      {loading && (
        <icons.documents.Pending className={classes.imageFallback} />
      )}
    </div>
  );
};

ImageViewer.propTypes = {
  info: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default ImageViewer;
