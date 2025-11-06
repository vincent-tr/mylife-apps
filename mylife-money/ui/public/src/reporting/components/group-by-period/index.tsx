'use strict';

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { mui, useLifecycle } from 'mylife-tools-ui';
import { getSortedViewList } from '../../selectors';
import { reportingLeave } from '../../actions';

import Criteria from './criteria';
import Chart from './chart';
import { formatCriteria } from './tools';

type FIXME_any = any;

const useConnect = ({ refreshAction, exportAction }) => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector((state: FIXME_any) => ({
      data: getSortedViewList(state)
    })),
    ...useMemo(() => ({
      refresh: (criteria) => dispatch(refreshAction(criteria)),
      exportReport: (criteria, display) => dispatch(exportAction(criteria, display)),
      leave: () => dispatch(reportingLeave()),
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

const GroupByPeriod = ({ refreshAction, exportAction, initialCriteria, initialDisplay, additionalCriteriaFactory, amountSelectorFactory }) => {
  const [criteria, setCriteria] = useState(initialCriteria);
  const [display, setDisplay] = useState(initialDisplay);

  const { exportReport, refresh, leave, data } = useConnect({ refreshAction, exportAction });

  // on mount run query, on leave clean
  useLifecycle(() => refresh(formatCriteria(criteria)), leave);

  const classes = useStyles();

  const changeCriteria = (criteria) => {
    setCriteria(criteria);
    refresh(formatCriteria(criteria));
  };

  const doExport = () => exportReport(formatCriteria(criteria), display);

  const groups = criteria.groups.toArray();

  const chartDisplay = {
    ...display,
    children: criteria.children,
  };

  const additionalCriteria = additionalCriteriaFactory({ display, onDisplayChanged: setDisplay, criteria, onCriteriaChanged: changeCriteria });

  return (
    <div className={classes.container}>
      <Criteria criteria={criteria} onCriteriaChanged={changeCriteria} display={display} onDisplayChanged={setDisplay} onExport={doExport} additionalComponents={additionalCriteria} />
      <Chart data={data} groups={groups} display={chartDisplay} className={classes.chart} amountSelector={amountSelectorFactory({ display, criteria })}/>
    </div>
  );
};

GroupByPeriod.propTypes = {
  refreshAction: PropTypes.func.isRequired,
  exportAction: PropTypes.func.isRequired,
  initialCriteria: PropTypes.object.isRequired,
  initialDisplay: PropTypes.object.isRequired,
  additionalCriteriaFactory: PropTypes.func.isRequired,
  amountSelectorFactory: PropTypes.func.isRequired,
};

export default GroupByPeriod;
