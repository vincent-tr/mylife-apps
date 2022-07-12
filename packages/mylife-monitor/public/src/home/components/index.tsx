'use strict';

import { React, useMemo, mui, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getNagiosView } from '../selectors';
import NagiosSummary from './nagios-summary';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      nagios: getNagiosView(state)
    })),
    ...useMemo(() => ({
      enter: () => dispatch(enter()),
      leave: () => dispatch(leave()),
    }), [dispatch])
  };
};

const useStyles = mui.makeStyles({
  container: {
    flex: '1 1 auto',
    overflowY: 'auto'
  },
});

const Home = () => {
  const classes = useStyles();
  const { enter, leave, nagios } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      {nagios.valueSeq().map(summary => (
        <NagiosSummary key={summary._id} data={summary} />
      ))}
    </div>
  );
};

export default Home;
