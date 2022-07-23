import { React, useMemo, mui, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import List from './list';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return useMemo(() => ({
    enter: () => dispatch(enter()),
    leave: () => dispatch(leave()),
  }), [dispatch]);
};

const useStyles = mui.makeStyles({
  main: {
    flex: '1 1 auto',
    overflowY: 'auto'
  }
});

const Slideshows = () => {
  const classes = useStyles();
  const { enter, leave } = useConnect();
  useLifecycle(enter, leave);

  return (
    <List className={classes.main} />
  );
};

export default Slideshows;
