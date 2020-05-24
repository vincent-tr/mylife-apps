'use strict';

import { React, mui, useState, useMemo } from 'mylife-tools-ui';
import { useErrorView } from '../../common/error-view';

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto'
  }
}));

const Errors = () => {
  const classes = useStyles();
  const { errorView } = useErrorView();

  return (
    <div className={classes.container}>
    </div>
  );
};

export default Errors;
