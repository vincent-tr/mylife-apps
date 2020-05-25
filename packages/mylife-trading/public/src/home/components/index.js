'use strict';

import { React, mui } from 'mylife-tools-ui';
import { useStrategyView } from '../../common/shared-views';
import Strategy from './strategy';

const useStyles = mui.makeStyles({
  main: {
    flex: '1 1 auto',
    overflowY: 'auto'
  }
});

const Home = () => {
  const classes = useStyles();
  const { strategies } = useStrategyView();

  return (
    <mui.List className={classes.main}>
      {strategies.map(strategy => (
        <mui.ListItem key={strategy._id}>
          <Strategy strategy={strategy} />
        </mui.ListItem>
      ))}
    </mui.List>
  );
};

export default Home;
