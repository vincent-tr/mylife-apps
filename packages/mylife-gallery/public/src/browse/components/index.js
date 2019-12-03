'use strict';

import { React, useMemo, useState, mui, useDispatch, useLifecycle, immutable } from 'mylife-tools-ui';
import { browseEnter, browseLeave } from '../actions';
import Criteria from './criteria';
import List from './list';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    enter : () => dispatch(browseEnter()),
    leave : () => dispatch(browseLeave()),
  }), [dispatch]);
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

// empty set means all
const initialCriteria = {
  minDate: null,
  maxDate: null,
  minIntegrationDate: null,
  maxIntegrationDate: null,
  type: new immutable.Set(),
  albums: new immutable.Set(),
  persons: new immutable.Set(),
  keywords: null,
  caption: null,
  path: null,
  pathDuplicate: false
};

const initialDisplay = {
  sortField: null,
  sortOrder: 'asc'
};

const Browse = () => {
  const classes = useStyles();
  const { enter, leave } = useConnect();
  useLifecycle(enter, leave);

  const [criteria, setCriteria] = useState(initialCriteria);
  const [display, setDisplay] = useState(initialDisplay);

  // https://stackoverflow.com/questions/58193166/usestate-hook-setter-incorrectly-overwrites-state
  const onCriteriaChanged = newCriteria => setCriteria(criteria => ({ ...criteria, ... newCriteria }));
  const onDisplayChanged = newDisplay => setDisplay(display => ({ ...display, ... newDisplay }));

  return (
    <div className={classes.container}>
      <Criteria className={classes.criteria} criteria={criteria} onCriteriaChanged={onCriteriaChanged} display={display} onDisplayChanged={onDisplayChanged} />
      <List className={classes.list} display={display}  />
    </div>
  );
};

export default Browse;
