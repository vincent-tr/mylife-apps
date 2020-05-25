'use strict';

import { React, useMemo, mui, useDispatch } from 'mylife-tools-ui';
import { useStrategyView } from '../../common/shared-views';
import { add } from '../actions';
import Strategy from './strategy';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    add: () => dispatch(add()),
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => ({
  main: {
    flex: '1 1 auto',
    overflowY: 'auto'
  },
  addButton: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

const Strategies = () => {
  const classes = useStyles();
  const { add } = useConnect();
  const { strategies } = useStrategyView();

  return (
    <>
      <mui.List className={classes.main}>
        {strategies.map(strategy => (
          <mui.ListItem key={strategy._id}>
            <Strategy strategy={strategy} />
          </mui.ListItem>
        ))}
      </mui.List>
      <mui.Tooltip title='Nouvelle stratégie'>
        <mui.Fab color='primary' className={classes.addButton} onClick={add}>
          <mui.icons.Add />
        </mui.Fab>
      </mui.Tooltip>
    </>
  );
};

export default Strategies;
