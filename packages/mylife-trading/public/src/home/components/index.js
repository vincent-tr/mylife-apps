'use strict';

import { React, useMemo, useSelector, mui, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { enter, leave, changeState } from '../actions';
import { getStrategyDisplayView, geStrategyStatusView } from '../selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      strategies: getStrategyDisplayView(state),
      strategyStatus: geStrategyStatusView(state),
    })),
    ...useMemo(() => ({
      enter: () => dispatch(enter()),
      leave: () => dispatch(leave()),
      changeState: (strategy, enabled) => dispatch(changeState(strategy, enabled)),
    }), [dispatch])
  };
};

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
  }
});

const Home = () => {
  const classes = useStyles();
  const { enter, leave } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      Trading
    </div>
  );
};

export default Home;
