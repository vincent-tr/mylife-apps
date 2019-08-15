'use strict';

import { React, useState, useMemo, mui, useDispatch, useSelector, immutable, useLifecycle } from 'mylife-tools-ui';
import { getSortedViewList } from '../../../selectors/reporting';
import { getGroupByMonth, reportingLeave } from '../../../actions/reporting';

import Criteria from './criteria';
import Chart from './chart';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      data : getSortedViewList(state)
    })),
    ...useMemo(() => ({
      refresh : (criteria) => dispatch(getGroupByMonth(criteria)),
      leave : () => dispatch(reportingLeave()),
    }), [dispatch])
  };
};

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto'
  },
  chart: {
    flex: '1 1 auto'
  }
});

const GroupByMonth = () => {
  const [criteria, setCriteria] = useState({
    invert: true,
    children: false,
    minDate: null,
    maxDate: null,
    account: null,
    groups: new immutable.List([ null ])
  });

  const { refresh, leave, data } = useConnect();

  // on mount run query, on leave clean
  useLifecycle(() => refresh(formatCriteria(criteria)), leave);

  const classes = useStyles();

  const changeCriteria = (criteria) => {
    setCriteria(criteria);
    refresh(formatCriteria(criteria));
  };

  const groups = criteria.groups.toArray();

  return (
    <div className={classes.container}>
      <Criteria criteria={criteria} onCriteriaChanged={changeCriteria} />
      <Chart data={data} groups={groups} className={classes.chart} />
    </div>
  );
};

export default GroupByMonth;

function formatCriteria(criteria) {
  const { groups, ...props } = criteria;
  return {
    groups: groups.toArray(),
    ...props
  };
}
