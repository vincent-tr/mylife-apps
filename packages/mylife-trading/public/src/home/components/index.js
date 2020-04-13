'use strict';

import { React, useMemo, mui, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { useStrategyView } from '../../common/strategy-view';
import { enter, leave } from '../actions';
import Strategy from './strategy';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    enter: () => dispatch(enter()),
    leave: () => dispatch(leave()),
  }), [dispatch]);
};

const useStyles = mui.makeStyles({
  main: {
    flex: '1 1 auto',
    overflowY: 'auto'
  }
});

const Home = () => {
  const classes = useStyles();
  const { strategies } = useStrategyView();
  const { enter, leave } = useConnect();
  useLifecycle(enter, leave);

  return (
    <mui.List className={classes.main}>
      {strategies.map(strategy => (
        <mui.ListItem key={strategy._id}>
          <Strategy strategy={strategy} />
        </mui.ListItem>
      ))}
    </mui.List>
  );
};

export default Home;
