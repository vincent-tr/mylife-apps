'use strict';

import { React, mui, useState } from 'mylife-tools-ui';
import Criteria from './criteria';
//import Chart from './chart';

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
  strategy: null
};

const Stats = () => {
  const classes = useStyles();
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);

  return (
    <div className={classes.container}>
      <Criteria criteria={criteria} onCriteriaChanged={setCriteria} />
      Chart
    </div>
  );
};

export default Stats;

// <Chart periodKey={periodKey} data={data} groups={groups} display={chartDisplay} className={classes.chart} amountSelector={amountSelectorFactory({ display, criteria })}/>