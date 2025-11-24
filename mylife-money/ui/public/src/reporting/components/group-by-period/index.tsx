import React, { useState, useMemo } from 'react';
import { useLifecycle } from 'mylife-tools-ui';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { reportingLeave, getSortedViewList } from '../../store';

import Criteria from './criteria';
import Chart from './chart';
import { formatCriteria } from './tools';
import { styled } from '@mui/material';

type FIXME_any = any;

const useConnect = ({ refreshAction, exportAction }) => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    data: useSelector(getSortedViewList),
    ...useMemo(
      () => ({
        refresh: (criteria) => dispatch(refreshAction(criteria)),
        exportReport: (criteria, display) => dispatch(exportAction({ criteria, display })),
        leave: () => dispatch(reportingLeave()),
      }),
      [dispatch]
    ),
  };
};

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
});

const StyledChart = styled(Chart)({
  flex: '1 1 auto',
});

const GroupByPeriod = ({ refreshAction, exportAction, initialCriteria, initialDisplay, additionalCriteriaFactory, amountSelectorFactory }) => {
  const [criteria, setCriteria] = useState(initialCriteria);
  const [display, setDisplay] = useState(initialDisplay);

  const { exportReport, refresh, leave, data } = useConnect({ refreshAction, exportAction });

  // on mount run query, on leave clean
  useLifecycle(() => refresh(formatCriteria(criteria)), leave);

  const changeCriteria = (criteria) => {
    setCriteria(criteria);
    refresh(formatCriteria(criteria));
  };

  const doExport = () => exportReport(formatCriteria(criteria), display);

  const chartDisplay = {
    ...display,
    children: criteria.children,
  };

  const additionalCriteria = additionalCriteriaFactory({ display, onDisplayChanged: setDisplay, criteria, onCriteriaChanged: changeCriteria });

  return (
    <Container>
      <Criteria
        criteria={criteria}
        onCriteriaChanged={changeCriteria}
        display={display}
        onDisplayChanged={setDisplay}
        onExport={doExport}
        additionalComponents={additionalCriteria}
      />
      <StyledChart data={data} groups={criteria.groups} display={chartDisplay} amountSelector={amountSelectorFactory({ display, criteria })} />
    </Container>
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
