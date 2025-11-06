'use strict';

import React from 'react';
import { mui } from 'mylife-tools-ui';
import Stats from './stats';
import ChartCount from './chart-count';
import ChartAmount from './chart-amount';

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
  }
});

const Home = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Stats/>
      <ChartCount/>
      <ChartAmount/>
    </div>
  );
};

export default Home;
