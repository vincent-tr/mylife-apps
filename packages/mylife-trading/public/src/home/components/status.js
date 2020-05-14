'use strict';

import humanizeDuration from 'humanize-duration';
import { React, PropTypes, useSelector, mui, clsx, addLineBreaks, useState, useEffect, useInterval } from 'mylife-tools-ui';
import { getFieldName } from '../../common/metadata-utils';
import { geStrategyStatusView } from '../selectors';

const useConnect = () => useSelector(state => ({
  strategyStatus: geStrategyStatusView(state),
}));

const useStyles = mui.makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  title: {
    fontWeight: 'bold'
  },
  error: {
    color: theme.palette.error.main
  }
}));

const Status = ({ strategy }) => {
  const classes = useStyles();
  const { strategyStatus } = useConnect();
  const status = strategyStatus.get(strategy._id);
  const delay = useFormatDelay(status);

  if(!status) {
    return null;
  }

  return (
    <mui.Grid container>
      <mui.Grid item xs={12} className={classes.cell}>
        <mui.Typography className={classes.title}>{getFieldName('strategy-status', 'status')}</mui.Typography>
        <mui.Typography>{`(${delay}) ${status.status}`}</mui.Typography>
      </mui.Grid>
      {status.error && (
        <mui.Grid item xs={12} className={clsx(classes.cell, classes.error)}>
          <mui.Typography className={classes.title}>{getFieldName('strategy-status', 'error')}</mui.Typography>
          <mui.Typography>{addLineBreaks(status.error)}</mui.Typography>
        </mui.Grid>
      )}
    </mui.Grid>
  );
};

Status.propTypes = {
  strategy: PropTypes.object.isRequired,
};

export default Status;

function useFormatDelay(status) {
  const [delay, setDelay] = useState();

  useEffect(computeDelay, [status]);
  useInterval(computeDelay, 500);

  return delay;

  function computeDelay() {
    if(!status) {
      setDelay(null);
      return;
    }
  
    const duration = new Date() - status.timestamp;
    const formatted = humanizeDuration(duration, { language: 'fr', largest: 2, round: true });
    setDelay(formatted);
  
  }
}
