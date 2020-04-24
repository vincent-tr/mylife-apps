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

const Home = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      Hello
    </div>
  );
};

export default Home;
