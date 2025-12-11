import { styled } from '@mui/material/styles';
import React, { useState, useMemo, useCallback } from 'react';
import { ReportingCriteria, ReportingDisplay } from '../../../api';
import { useAppSelector, useAppDispatch } from '../../../store-api';
import { getSortedViewList, downloadExport } from '../../store';
import { useReportingView } from '../../views';
import Chart, { AmoutSelector } from './chart';
import Criteria from './criteria';
import { formatCriteria } from './tools';

const useConnect = (type: 'month' | 'year', exportFilename: string) => {
  const dispatch = useAppDispatch();
  return {
    data: useAppSelector(getSortedViewList),
    ...useMemo(
      () => ({
        exportReport: ({ criteria, display }: { criteria: ReportingCriteria; display: ReportingDisplay }) =>
          dispatch(downloadExport({ criteria, display, type, fileName: exportFilename })),
      }),
      [dispatch, type, exportFilename]
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

export interface AdditionalCriteriaFactoryProps {
  criteria: ReportingCriteria;
  onCriteriaChanged: (criteria: ReportingCriteria) => void;
  display: ReportingDisplay;
  onDisplayChanged: (display: ReportingDisplay) => void;
}

export interface AmountSelectorFactoryProps {
  criteria: ReportingCriteria;
  display: ReportingDisplay;
}

export interface GroupByPeriodProps {
  type: 'month' | 'year';
  exportFilename: string;
  initialCriteria: ReportingCriteria;
  initialDisplay: ReportingDisplay;
  additionalCriteriaFactory: (props: AdditionalCriteriaFactoryProps) => React.ReactNode;
  amountSelectorFactory: (props: AmountSelectorFactoryProps) => AmoutSelector;
}

export default function GroupByPeriod({ type, exportFilename, initialCriteria, initialDisplay, additionalCriteriaFactory, amountSelectorFactory }: GroupByPeriodProps) {
  const [criteria, setCriteria] = useState(initialCriteria);
  const [display, setDisplay] = useState(initialDisplay);

  const formattedCriteria = useMemo(() => formatCriteria(criteria), [criteria]);

  useReportingView(type, formattedCriteria);

  const { exportReport, data } = useConnect(type, exportFilename);

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
