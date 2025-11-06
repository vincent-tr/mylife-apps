'use strict';

import React from 'react';
import { format as formatDate } from 'date-fns';
import { mui } from 'mylife-tools-ui';
import { useOperationStats } from '../views';

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
  const { view } = useOperationStats();
  const count = statValue(view, 'count');
  const lastDate = statValue(view, 'lastDate');
  const unsortedCount = statValue(view, 'unsortedCount');

  return (
    <div {...props}>
      <div className={classes.container}>
        <mui.Typography>{`Nombre total d'opérations : ${count}`}</mui.Typography>
        <mui.Typography>{`Nombre d'opérations non triées cette année : ${unsortedCount}`}</mui.Typography>
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
