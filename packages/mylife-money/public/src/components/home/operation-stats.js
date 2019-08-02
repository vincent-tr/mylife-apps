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
      <mui.Typography>{`Nombre total d'opérations : ${count}`}</mui.Typography>
      <mui.Typography>{`Date de l'opération la plus récente : ${lastDate && formatDate(lastDate, 'dd/MM/yyyy')}`}</mui.Typography>
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
