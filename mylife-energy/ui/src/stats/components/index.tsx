import { styled } from '@mui/material/styles';
import { useReducer, useEffect } from 'react';
import { useActions } from 'mylife-tools';
import { fetchValues } from '../store';
import { StatsType } from '../types';
import { useDevicesView } from '../views';
import Chart from './chart';
import CriteriaSelector, { Criteria } from './criteria-selector';

const Container = styled('div')({
  flex: '1 1 auto',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
});

const StyledChart = styled(Chart)({
  flex: '1 1 auto',
});

export default function Stats() {
  useDevicesView();
  const { fetchValues: localFetchValues } = useActions({ fetchValues });

  const [criteria, onCriteriaChange] = useReducer((criteria: Criteria, props: Partial<Criteria>) => ({ ...criteria, ...props }), {
    type: StatsType.Day,
    date: new Date(),
    devices: [],
  } as Criteria);

  useEffect(() => {
    localFetchValues({ type: criteria.type, timestamp: criteria.date, sensors: criteria.devices });
  }, [criteria, localFetchValues]);

  return (
    <Container>
      <CriteriaSelector criteria={criteria} onChange={onCriteriaChange} />
      <StyledChart type={criteria.type} />
    </Container>
  );
}
