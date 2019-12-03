'use strict';

import { React, useMemo, mui, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import Values from './values';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    enter : () => dispatch(enter()),
    leave : () => dispatch(leave()),
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

const Stats = () => {
  const classes = useStyles();
  const { enter, leave } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      <Values />
    </div>
  );
};

export default Stats;
