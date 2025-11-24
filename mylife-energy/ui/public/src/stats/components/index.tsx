import React, { useReducer, useEffect } from 'react';
import { styled } from '@mui/material';
import { useActions, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { fetchValues } from '../store';
import { StatsType } from '../types';
import CriteriaSelector, { Criteria } from './criteria-selector';
import Chart from './chart';

const Container = styled('div')({
  flex: '1 1 auto',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
});

const StyledChart = styled(Chart)({
  flex: '1 1 auto',
});

const Stats: React.FC = () => {
  useViewLifecycle();
  const actions = useActions({ fetchValues });

  const [criteria, onCriteriaChange] = useReducer(
    (criteria: Criteria, props: Partial<Criteria>) => ({ ... criteria, ...props }), 
    { type: StatsType.Day, date: new Date(), devices: [] } as Criteria
  );

  useEffect(() => {
    actions.fetchValues({ type: criteria.type, timestamp: criteria.date, sensors: criteria.devices });
  }, [criteria]);

  return (
    <Container>
      <CriteriaSelector criteria={criteria} onChange={onCriteriaChange} />
      <StyledChart type={criteria.type} />
    </Container>
  );
};

export default Stats;

function useViewLifecycle() {
  const actions = useActions({ enter, leave });
  useLifecycle(actions.enter, actions.leave);
}
