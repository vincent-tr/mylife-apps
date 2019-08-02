'use strict';

import { React, mui, useSelector, formatDate } from 'mylife-tools-ui';
import { getOperationStatsView } from '../../selectors/reporting';

const useConnect = () => useSelector(state => ({
  stats : getOperationStatsView(state),
}));

const OperationStats = () => {
  const { stats } = useConnect();
  const count = statValue(stats, 'count');
  const lastDate = statValue(stats, 'lastDate');

  return (
    <React.Fragment>
      <mui.Typography>{`Total operations count ${count}`}</mui.Typography>
      <mui.Typography>{`Last import date (= last operation date) ${lastDate && formatDate(lastDate, 'dd/MM/yyyy')}`}</mui.Typography>
    </React.Fragment>
  );
};

export default OperationStats;

function statValue(stats, code) {
  const stat = stats.find(stat => stat.code === code);
  if(!stat) {
    return null;
  }
  return stat.value;
}
