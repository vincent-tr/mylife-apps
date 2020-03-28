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
}));

const Status = ({ strategy }) => {
  const classes = useStyles();
  const { strategyStatus } = useConnect();

  const status = strategyStatus.get(strategy._id);
  if(!status) {
    return null;
  }

  return (
    <>
      <mui.Typography>{getFieldName('strategy-status', 'status')}</mui.Typography>
      <mui.Typography>{status.status}</mui.Typography>
      {status.error && (
        <>
          <mui.Typography>{getFieldName('strategy-status', 'error')}</mui.Typography>
          <mui.Typography>{status.error}</mui.Typography>
        </>
      )}
    </>
  );
};

Status.propTypes = {
  strategy: PropTypes.object.isRequired,
};
  
export default Status;
