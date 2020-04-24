'use strict';

import { React, mui } from 'mylife-tools-ui';

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
  }
});

const Home = ({ path }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {path}
    </div>
  );
};

export default Home;
