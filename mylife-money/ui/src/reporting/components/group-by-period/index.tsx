import { styled } from '@mui/material/styles';
import React, { useState, useMemo, useCallback } from 'react';
import { views } from 'mylife-tools';
import { ReportingCriteria, ReportingDisplay } from '../../../api';
import { useAppSelector, useAppDispatch } from '../../../store';
import { getSortedViewList, setViewId, clearViewId, getViewId, downloadExport } from '../../store';
import Chart from './chart';
import Criteria from './criteria';
import { formatCriteria } from './tools';

const useConnect = ({ exportType, exportFilename }) => {
  const dispatch = useAppDispatch();
  return {
    data: useAppSelector(getSortedViewList),
    ...useMemo(
      () => ({
        exportReport: ({ criteria, display }: { criteria: ReportingCriteria; display: ReportingDisplay }) =>
          dispatch(downloadExport({ criteria, display, type: exportType, fileName: exportFilename })),
      }),
      [dispatch, exportType, exportFilename]
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

export interface GroupByPeriodProps {
  exportType: 'month' | 'year';
  exportFilename: string;
  initialCriteria;
  initialDisplay;
  additionalCriteriaFactory: (props) => React.ReactNode;
  amountSelectorFactory: (props) => any;
}

export default function GroupByPeriod({ exportType, exportFilename, initialCriteria, initialDisplay, additionalCriteriaFactory, amountSelectorFactory }: GroupByPeriodProps) {
  const [criteria, setCriteria] = useState(initialCriteria);
  const [display, setDisplay] = useState(initialDisplay);

  const formattedCriteria = useMemo(() => formatCriteria(criteria), [criteria]);

  let method: string;
  switch (exportType) {
    case 'month':
      method = 'notifyGroupByMonth';
      break;
    case 'year':
      method = 'notifyGroupByYear';
      break;
    default:
      throw new Error(`Unsupported export type: ${exportType}`);
  }

  views.useCriteriaView({
    service: 'reporting',
    method,
    criteria: formattedCriteria,

    setViewIdAction: setViewId,
    clearViewIdAction: clearViewId,
    viewIdSelector: getViewId,
  });

  const { exportReport, data } = useConnect({ exportType, exportFilename });

  const doExport = useCallback(() => exportReport({ criteria: formattedCriteria, display }), [exportReport, formattedCriteria, display]);

  const chartDisplay = {
    ...display,
    children: criteria.children,
  };

  const additionalCriteria = additionalCriteriaFactory({ display, onDisplayChanged: setDisplay, criteria, onCriteriaChanged: setCriteria });

  return (
    <Container>
      <Criteria criteria={criteria} onCriteriaChanged={setCriteria} display={display} onDisplayChanged={setDisplay} onExport={doExport} additionalComponents={additionalCriteria} />
      <StyledChart data={data} groups={criteria.groups} display={chartDisplay} amountSelector={amountSelectorFactory({ display, criteria })} />
    </Container>
  );
}
