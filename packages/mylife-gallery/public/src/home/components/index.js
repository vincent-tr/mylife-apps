'use strict';

import { React, useMemo, mui, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { enter, leave, changeCriteria, changeDisplay } from '../actions';
import { getCriteria, getDisplay, getDisplayView } from '../selectors';
import Criteria from './criteria';
import List from './list';
import ListFooter from '../../common/list-footer';

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
  const { criteria, display, data, enter, leave, changeCriteria, changeDisplay } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      <Criteria className={classes.criteria} criteria={criteria} onCriteriaChanged={changeCriteria} display={display} onDisplayChanged={changeDisplay} />
      <List className={classes.list} display={display} data={data}  />
      <ListFooter text={`${data.length} albums(s)`} />
    </div>
  );
};

export default Home;
