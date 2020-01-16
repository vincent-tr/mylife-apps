'use strict';

import { React, useMemo, mui, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getDisplayView } from '../selectors';
import List from './list';
import ListFooter from '../../common/list-footer';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      data: getDisplayView(state)
    })),
    ...useMemo(() => ({
      enter: () => dispatch(enter()),
      leave: () => dispatch(leave()),
    }), [dispatch])
  };
};

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
  },
  criteria: {
  },
  list: {
    flex: '1 1 auto'
  }
});

const Home = () => {
  const classes = useStyles();
  const { data, enter, leave } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      <List className={classes.list} data={data}  />
      <ListFooter text={`${data.length} diaporama(s)`} />
    </div>
  );
};

export default Home;
