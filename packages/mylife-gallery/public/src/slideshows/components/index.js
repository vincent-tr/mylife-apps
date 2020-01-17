'use strict';

import { React, useMemo, mui, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import List from './list';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    enter: () => dispatch(enter()),
    leave: () => dispatch(leave()),
  }), [dispatch]);
};

const useStyles = mui.makeStyles({
  main: {
    flex: '1 1 auto'
  }
});

const Home = () => {
  const classes = useStyles();
  const { enter, leave } = useConnect();
  useLifecycle(enter, leave);

  return (
    <List className={classes.main} />
  );
};

export default Home;
