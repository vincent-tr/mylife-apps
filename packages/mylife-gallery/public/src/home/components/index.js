'use strict';

import { React, useMemo, mui, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { enter, leave, changeCriteria, changeDisplay } from '../actions';
import { getCriteria, getDisplay, getDisplayView } from '../selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      criteria: getCriteria(state),
      display: getDisplay(state),
      data: getDisplayView(state)
    })),
    ...useMemo(() => ({
      enter: () => dispatch(enter()),
      leave: () => dispatch(leave()),
      changeCriteria: (criteria) => dispatch(changeCriteria(criteria)),
      changeDisplay: (display) => dispatch(changeDisplay(display)),
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
  const { enter, leave } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      Home <br/>
    </div>
  );
};

export default Home;
