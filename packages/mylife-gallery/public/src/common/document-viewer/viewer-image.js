'use strict';

import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';

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

const ViewerImage = ({ info, className, ...props }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.container, className)} {...props}>
      <img src={info.contentUrl} className={classes.image} />
    </div>
  );
};

ViewerImage.propTypes = {
  info: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default ViewerImage;
