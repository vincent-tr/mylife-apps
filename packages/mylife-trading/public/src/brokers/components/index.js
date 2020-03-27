'use strict';

import { React, useMemo, mui, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { enter, leave, add, update, remove } from '../actions';
import { getDisplayView } from '../selectors';

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
      update: (broker, changes) => dispatch(update(broker, changes)),
      remove: (broker) => dispatch(remove(broker)),
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
  const { enter, leave, add, update, remove, data } = useConnect();
  useLifecycle(enter, leave);

  return (
    <>
      <mui.List className={classes.main}>
        {data.map(broker => (
          <mui.ListItem key={broker._id}>
            <mui.Grid container spacing={2}>
              {broker.display}
            </mui.Grid>
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
