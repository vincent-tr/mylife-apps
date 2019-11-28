'use strict';

import { React, useMemo, mui, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { browseEnter, browseLeave } from '../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    enter : () => dispatch(browseEnter()),
    leave : () => dispatch(browseLeave()),
  }), [dispatch]);
};

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
  }
});

const Browse = () => {
  const classes = useStyles();
  const { enter, leave } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      Browse
    </div>
  );
};

export default Browse;
