'use strict';

import { React, useMemo, useSelector, mui, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { enter, leave, changeState } from '../actions';
import { getStrategyDisplayView } from '../selectors';
import Strategy from './strategy';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      strategies: getStrategyDisplayView(state),
    })),
    ...useMemo(() => ({
      enter: () => dispatch(enter()),
      leave: () => dispatch(leave()),
    }), [dispatch])
  };
};

const useStyles = mui.makeStyles({
  main: {
    flex: '1 1 auto',
    overflowY: 'auto'
  }
});

const Home = () => {
  const classes = useStyles();
  const { enter, leave, strategies } = useConnect();
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
