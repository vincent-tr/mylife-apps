'use strict';

import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => ({
  loading: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    margin: 'auto',
    color: mui.colors.grey[800]
  }
}));

const Loading = ({ className }) => {
  const classes = useStyles();
  return (
    <mui.CircularProgress className={clsx(classes.loading, className)} />
  );
};

Loading.propTypes = {
  className: PropTypes.string
};

export default Loading;
