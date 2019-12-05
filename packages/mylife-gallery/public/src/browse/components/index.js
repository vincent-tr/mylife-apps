'use strict';

import { React, useMemo, useState, mui, useDispatch, useSelector, useLifecycle, immutable } from 'mylife-tools-ui';
import { enter, leave, changeCriteria, changeDisplay } from '../actions';
import { getDisplay, getDisplayView } from '../selectors';
import Criteria from './criteria';
import List from './list';
import Footer from './footer';

const LIST_MAX_SIZE = 1000;

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      display: getDisplay(state),
      data: getDisplayView(state)
    })),
    ...useMemo(() => ({
      enter: () => dispatch(enter()),
      leave: () => dispatch(leave()),
      changeCriteria: (criteria) => dispatch(changeCriteria(criteria)),
      changeDisplay: (criteria) => dispatch(changeDisplay(criteria)),
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

// empty set means all
const initialCriteria = {
  minDate: null,
  maxDate: null,
  minIntegrationDate: null,
  maxIntegrationDate: null,
  type: new immutable.Set(),
  albums: new immutable.Set(),
  noAlbum: false,
  persons: new immutable.Set(),
  noPerson: false,
  keywords: null,
  caption: null,
  path: null,
  pathDuplicate: false,
  minWidth: null,
  maxWidth: null,
  minHeight: null,
  maxHeight: null,
};

const Browse = () => {
  const classes = useStyles();
  const { display, data, enter, leave, changeCriteria, changeDisplay } = useConnect();
  useLifecycle(enter, leave);

  const [criteria, setCriteria] = useState(initialCriteria);

  // https://stackoverflow.com/questions/58193166/usestate-hook-setter-incorrectly-overwrites-state
  const onCriteriaChanged = changes => setCriteria(criteria => {
    const newCriteria = ({ ...criteria, ... changes });
    changeCriteria(newCriteria);
    return newCriteria;
  });

  const displayData = data.slice(0, LIST_MAX_SIZE);

  return (
    <div className={classes.container}>
      <Criteria className={classes.criteria} criteria={criteria} onCriteriaChanged={onCriteriaChanged} display={display} onDisplayChanged={changeDisplay} />
      <List className={classes.list} display={display} data={displayData}  />
      <Footer fullSize={data.length} displayedSize={displayData.length} />
    </div>
  );
};

export default Browse;
