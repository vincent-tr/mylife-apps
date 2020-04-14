'use strict';

import { React, mui, useState, useMemo } from 'mylife-tools-ui';
import { useStatView } from '../../common/stat-view';
import Criteria from './criteria';
import Chart from './chart';
import { groupBy, aggregation, chartType } from './lists';
import { computeData } from './engine';

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
  aggregation: aggregation[0].id,
  chartType: chartType[0].id
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
      <Chart className={classes.chart} data={data} valueText={aggregationItem.text} chartType={criteria.chartType} />
    </div>
  );
};

export default Stats;
