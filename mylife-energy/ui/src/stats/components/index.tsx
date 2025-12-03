import { styled } from '@mui/material/styles';
import { useReducer, useEffect } from 'react';
import { useAction } from 'mylife-tools';
import { StatsType } from '../../api';
import { fetchValues as fetchValuesAction } from '../store';
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
  const fetchValues = useAction(fetchValuesAction);

  const [criteria, onCriteriaChange] = useReducer((criteria: Criteria, props: Partial<Criteria>) => ({ ...criteria, ...props }), {
    type: StatsType.Day,
    date: new Date(),
    devices: [],
  } as Criteria);

  useEffect(() => {
    fetchValues({ type: criteria.type, timestamp: criteria.date, sensors: criteria.devices });
  }, [criteria, fetchValues]);

  return (
    <Container>
      <CriteriaSelector criteria={criteria} onChange={onCriteriaChange} />
      <StyledChart type={criteria.type} />
    </Container>
  );
}
