'use strict';

import { React, useMemo, mui, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { enter, leave, changeCriteria, changeDisplay } from '../actions';
import { getCriteria, getDisplay, getDisplayView } from '../selectors';
import Criteria from './criteria';
import DocumentList from '../../document-list/components';

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

const Browse = () => {
  const classes = useStyles();
  const { criteria, display, data, enter, leave, changeCriteria, changeDisplay } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      <Criteria className={classes.criteria} criteria={criteria} onCriteriaChanged={changeCriteria} display={display} onDisplayChanged={changeDisplay} />
      <DocumentList className={classes.list} documents={data} />
    </div>
  );
};

export default Browse;
