'use strict';

import { React, PropTypes, mui, clsx, useState, useEffect } from 'mylife-tools-ui';

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
  pending: {
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

const ImageViewer = ({ mediaUrl, className, ...props }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  // onLoadStart not fired on chrome
  useEffect(() => setLoading(true), [mediaUrl]);

  return (
    <div className={clsx(classes.container, className)} {...props}>
      <img
        src={mediaUrl}
        onLoad={() => setLoading(false)}
        className={clsx(classes.image, { [classes.imageLoading]: loading })} />
      {loading && (
        <mui.CircularProgress className={classes.pending} />
      )}
    </div>
  );
};

ImageViewer.propTypes = {
  mediaUrl: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ImageViewer;
