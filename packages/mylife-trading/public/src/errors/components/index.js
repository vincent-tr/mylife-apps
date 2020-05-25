'use strict';

import { React, mui } from 'mylife-tools-ui';
import { useErrorView } from '../../common/shared-views';

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto'
  }
}));

const Errors = () => {
  const classes = useStyles();
  const { view } = useErrorView();

  return (
    <div className={classes.container}>
    </div>
  );
};

export default Errors;
