'use strict';

import { React, useMemo, mui, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getNagiosView, getUpsmonView, getUpdatesView } from '../selectors';
import NagiosSummary from './nagios-summary';
import UpsmonSummary from './upsmon-summary';
import UpdatesSummary from './updates-summary';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector(state => ({
      nagios: getNagiosView(state),
      upsmon: getUpsmonView(state),
      updates: getUpdatesView(state),
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
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
  },
});

const Home = () => {
  const classes = useStyles();
  const { enter, leave, nagios, upsmon, updates } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      <div className={classes.section}>
        {nagios.valueSeq().map(summary => (
          <NagiosSummary key={summary._id} data={summary} />
        ))}
      </div>
      
      <div className={classes.section}>
        <UpsmonSummary view={upsmon} />
      </div>

      <div className={classes.section}>
        <UpdatesSummary view={updates} />
      </div>
    </div>
  );
};

export default Home;
