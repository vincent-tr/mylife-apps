import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { format as formatDate } from 'date-fns';
import { views } from 'mylife-tools';
import { ReportOperationStat } from '../../api';
import { useOperationStatsView } from '../views';

const Container = styled('div')({
  marginTop: 20,
  marginRight: 20,
  marginLeft: 20,
  marginBottom: 20,
});

export default function Stats() {
  const view = useOperationStatsView();
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
}

function statValue(stats: views.View<ReportOperationStat>, code) {
  const stat = Object.values(stats).find((stat) => stat.code === code);
  if (!stat) {
    return null;
  }
  return stat.value;
}
