import { React, mui, useLifecycle, useActions } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import MainAnimation from './main-animation';
import NodeTable from './node-table';

const useStyles = mui.makeStyles(theme => ({
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Live = () => {
  useViewLifecycle();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <MainAnimation />
      <NodeTable />
    </div>
  );
};

export default Live;

function useViewLifecycle() {
  const actions = useActions({ enter, leave });
  useLifecycle(actions.enter, actions.leave);
}
