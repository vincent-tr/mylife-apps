'use strict';

import { React, mui, useSelector, formatDate } from 'mylife-tools-ui';
import { getOperationStatsView } from '../selectors';

const useConnect = () => useSelector(state => ({
  stats : getOperationStatsView(state),
}));


const useStyles = mui.makeStyles({
  container: {
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20
  }
});

const Stats = (props) => {
  const classes = useStyles();
  const { stats } = useConnect();
  const count = statValue(stats, 'count');
  const lastDate = statValue(stats, 'lastDate');

  return (
    <div {...props}>
      <div className={classes.container}>
        <mui.Typography>{`Nombre total d'opérations : ${count}`}</mui.Typography>
        <mui.Typography>{`Date de l'opération la plus récente : ${lastDate && formatDate(lastDate, 'dd/MM/yyyy')}`}</mui.Typography>
      </div>
    </div>
  );
};

export default Stats;

function statValue(stats, code) {
  const stat = stats.find(stat => stat.code === code);
  if(!stat) {
    return null;
  }
  return stat.value;
}
