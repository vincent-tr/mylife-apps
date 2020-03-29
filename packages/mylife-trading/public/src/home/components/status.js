'use strict';

import { React, PropTypes, useSelector, mui } from 'mylife-tools-ui';
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
  }
}));

const Status = ({ strategy }) => {
  const classes = useStyles();
  const { strategyStatus } = useConnect();

  const status = strategyStatus.get(strategy._id);
  if(!status) {
    return null;
  }

  return (
    <mui.Grid container>
      <mui.Grid item xs={12} className={classes.cell}>
        <mui.Typography className={classes.title}>{getFieldName('strategy-status', 'status')}</mui.Typography>
        <mui.Typography>{status.status}</mui.Typography>
      </mui.Grid>
      {status.error && (
        <mui.Grid item xs={12} className={classes.cell}>
          <mui.Typography className={classes.title}>{getFieldName('strategy-status', 'error')}</mui.Typography>
          <mui.Typography>{status.error}</mui.Typography>
        </mui.Grid>
      )}
    </mui.Grid>
  );
};

Status.propTypes = {
  strategy: PropTypes.object.isRequired,
};
  
export default Status;
