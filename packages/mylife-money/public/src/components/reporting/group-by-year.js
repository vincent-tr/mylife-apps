'use strict';

import { React, PropTypes, useState, useMemo, mui, useDispatch, useSelector, immutable, useLifecycle } from 'mylife-tools-ui';
import { getSortedViewList } from '../../../selectors/reporting';
import { getGroupByYear, reportingLeave } from '../../../actions/reporting';

import Criteria from '../group-by-period/criteria';
import Chart from '../group-by-period/chart';
import Field from '../common/field';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      data : getSortedViewList(state)
    })),
    ...useMemo(() => ({
      refresh : (criteria) => dispatch(getGroupByYear(criteria)),
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

const AdditionalCriteria = ({ display, onDisplayChanged }) => {
  const setDisplay = (name, value) => onDisplayChanged({ ...display, [name]: value });
  const onMonthAverageChanged = (value) => setDisplay('monthAverage', value);

  return (
    <React.Fragment>
      <mui.Grid item xs={4}>
        <Field label='Moyenne par mois'>
          <mui.Checkbox color='primary' checked={display.monthAverage} onChange={e => onMonthAverageChanged(e.target.checked)} />
        </Field>
      </mui.Grid>
      <mui.Grid item xs={8} />
    </React.Fragment>
  );
};

AdditionalCriteria.propTypes = {
  display: PropTypes.object.isRequired,
  onDisplayChanged: PropTypes.func.isRequired
};

const GroupByYear = () => {
  const [criteria, setCriteria] = useState({
    children: false,
    minDate: null,
    maxDate: null,
    account: null,
    groups: new immutable.List([ null ])
  });

  const [display, setDisplay] = useState({
    invert: true,
    fullnames: false,
    monthAverage: false
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

  const chartDisplay = {
    ...display,
    children: criteria.children,
  };

  const additionalCriteria = (
    <AdditionalCriteria display={display} onDisplayChanged={setDisplay} />
  );

  return (
    <div className={classes.container}>
      <Criteria criteria={criteria} onCriteriaChanged={changeCriteria} display={display} onDisplayChanged={setDisplay} additionalComponents={additionalCriteria} />
      <Chart periodKey='year' data={data} groups={groups} display={chartDisplay} className={classes.chart} />
    </div>
  );
};

export default GroupByYear;

function formatCriteria(criteria) {
  const { groups, fullnames, ...props } = criteria;
  void fullnames;
  return {
    groups: groups.toArray(),
    ...props
  };
}
