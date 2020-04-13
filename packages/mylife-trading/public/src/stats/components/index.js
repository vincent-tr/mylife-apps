'use strict';

import { React, mui, useState, useMemo } from 'mylife-tools-ui';
import { useStatView } from '../../common/stat-view';
import Criteria from './criteria';
import Chart from './chart';
import { groupBy, aggregation } from './lists';

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
  groupBy: groupBy[0].id,
  aggregation: aggregation[0].id
};

const Stats = () => {
  const classes = useStyles();
  const { statView } = useStatView();
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);
  const aggregationItem = aggregation.find(item => item.id === criteria.aggregation);

  const data = useMemo(() => computeData(statView, criteria), [statView, criteria]);

  return (
    <div className={classes.container}>
      <Criteria criteria={criteria} onCriteriaChanged={setCriteria} />
      <Chart className={classes.chart} data={data} valueText={aggregationItem.text} />
    </div>
  );
};

export default Stats;

function computeData(statView, criteria) {
  if(!criteria.strategy) {
    return [];
  }

  // TODO
  return [
    { date: 'date1', value: 1 },
    { date: 'date2', value: 2 },
  ];
}