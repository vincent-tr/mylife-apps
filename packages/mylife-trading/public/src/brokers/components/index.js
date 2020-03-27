'use strict';

import { React, useMemo, mui, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { enter, leave, add } from '../actions';
import { getDisplayView } from '../selectors';
import Broker from './broker';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      data: getDisplayView(state),
    })),
    ...useMemo(() => ({
      enter: () => dispatch(enter()),
      leave: () => dispatch(leave()),
      add: () => dispatch(add()),
    }), [dispatch])
  };
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

const Brokers = () => {
  const classes = useStyles();
  const { enter, leave, add, data } = useConnect();
  useLifecycle(enter, leave);

  return (
    <>
      <mui.List className={classes.main}>
        {data.map(broker => (
          <mui.ListItem key={broker._id}>
            <Broker broker={broker} />
          </mui.ListItem>
        ))}
      </mui.List>
      <mui.Tooltip title='Nouveau compte'>
        <mui.Fab color='primary' className={classes.addButton} onClick={add}>
          <mui.icons.Add />
        </mui.Fab>
      </mui.Tooltip>
    </>
  );
};

export default Brokers;
