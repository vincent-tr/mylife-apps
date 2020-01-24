'use strict';

import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => ({
  loading: {
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
