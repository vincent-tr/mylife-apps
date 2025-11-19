import React, { FC } from 'react';
import { format as formatDate } from 'date-fns';
import { useOperationStats } from '../views';
import { styled, Typography } from '@mui/material';

const Container = styled('div')({
  marginTop: 20,
  marginRight: 20,
  marginLeft: 20,
  marginBottom: 20
});

const Stats: React.FC = () => {
  const { view } = useOperationStats();
  const count = statValue(view, 'count');
  const lastDate = statValue(view, 'lastDate');
  const unsortedCount = statValue(view, 'unsortedCount');

  return (
    <Container>
      <Typography>{`Nombre total d'opérations : ${count}`}</Typography>
      <Typography>{`Nombre d'opérations non triées cette année : ${unsortedCount}`}</Typography>
      <Typography>{`Date de l'opération la plus récente : ${lastDate && formatDate(lastDate, 'dd/MM/yyyy')}`}</Typography>
    </Container>
  );
};

export default Stats;

function statValue(stats, code) {
  const stat = stats.find(stat => stat.code === code);
  if(!stat) {
    return null;
  }
  return stat.value;
}
