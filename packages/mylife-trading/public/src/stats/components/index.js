'use strict';

import { React, mui } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => ({
  main: {
    flex: '1 1 auto',
    overflowY: 'auto'
  }
}));

const Stats = () => {
  const classes = useStyles();
  return (
    <div className={classes.main}>
      Stats
    </div>
  );
};

export default Stats;
