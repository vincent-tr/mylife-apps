'use strict';

import { React, useMemo, mui, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { enter, leave, changeCriteria } from '../actions';
import { getCriteria, getDisplayView } from '../selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      criteria: getCriteria(state),
      data: getDisplayView(state)
    })),
    ...useMemo(() => ({
      enter: () => dispatch(enter()),
      leave: () => dispatch(leave()),
      changeCriteria: (criteria) => dispatch(changeCriteria(criteria)),
    }), [dispatch])
  };
};

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
  }
});

const Nagios = () => {
  const classes = useStyles();
  const { enter, leave, data } = useConnect();
  useLifecycle(enter, leave);

  console.log(data);

  return (
    <div className={classes.container}>
      Nagios
    </div>
  );
};

export default Nagios;
