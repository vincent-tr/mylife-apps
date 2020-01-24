'use strict';

import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';

const useStyles = mui.makeStyles({
  image: {
    objectFit: 'scale-down',
    width: '100%',
    height: '100%',
  },
});

const Image = ({ slideshow, url, className, ...props }) => {
  // TODO: transition
  const classes = useStyles();
  return (
    <img src={url} className={clsx(classes.image, className)} {...props} />
  );
};

Image.propTypes = {
  slideshow: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default Image;
