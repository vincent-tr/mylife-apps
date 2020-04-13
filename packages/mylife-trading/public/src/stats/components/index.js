'use strict';

import { React, mui, useState } from 'mylife-tools-ui';
import Criteria from './criteria';
import Chart from './chart';

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto'
  },
  chart: {
    flex: '1 1 auto'
  }
}));

const DEFAULT_CRITERIA = {
  strategy: null,
  groupBy: 'day',
  aggregation: 'count'
};

const test = [
  { date: 'date1', value: 1 },
  { date: 'date2', value: 2 },
]

const Stats = () => {
  const classes = useStyles();
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);

  return (
    <div className={classes.container}>
      <Criteria criteria={criteria} onCriteriaChanged={setCriteria} />
      <Chart className={classes.chart} data={test} valueText={'Toto'} />
    </div>
  );
};

export default Stats;
