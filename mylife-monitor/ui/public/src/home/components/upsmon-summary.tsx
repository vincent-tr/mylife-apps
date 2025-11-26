import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import humanizeDuration from 'humanize-duration';
import React from 'react';
import { views } from 'mylife-tools';
import { useSince } from '../../common/behaviors';
import icons from '../../common/icons';
import { SuccessCell, ErrorCell } from '../../common/table-status';

const Container = styled(Paper)(({ theme }) => ({
  display: 'inline-block',
  width: 300,
  margin: theme.spacing(4),
}));

const HeaderCell = styled('div')(({ theme }) => ({
  display: 'flex',
  '& > *': {
    marginRight: theme.spacing(2),
  },
}));

const formatDuration = humanizeDuration.humanizer({
  language: 'shortFr',
  largest: 1,
  round: true,

  languages: {
    shortFr: {
      y: () => 'ans',
      mo: () => 'mois',
      w: () => 'semaines',
      d: () => 'jours',
      h: () => 'heures',
      m: () => 'min',
      s: () => 'sec',
      ms: () => 'ms',
    },
  },
});

const UpsmonSummary = ({ view }) => {
  return (
    <Container>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>
              <HeaderCell>
                <icons.menu.Upsmon />
                {'UPS Monitor'}
              </HeaderCell>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{'Nom'}</TableCell>
            <TableCell>{'Statut'}</TableCell>
            <TableCell>{'Mise à jour'}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.values(view).map((data: views.Entity) => (
            <Row key={data._id} data={data} />
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default UpsmonSummary;

const Row = ({ data }) => {
  const statusOk = data.status == 'ONLINE';
  const lastUpdate = useSince(data.date);
  const lastUpdateOk = lastUpdate < 5 * 60 * 1000; // 5 mins
  const lastUpdateStr = formatDuration(lastUpdate);

  const StatusCell = statusOk ? SuccessCell : ErrorCell;
  const UpdateCell = lastUpdateOk ? SuccessCell : ErrorCell;

  return (
    <TableRow>
      <TableCell>{data.upsName}</TableCell>
      <StatusCell>{data.status}</StatusCell>
      <UpdateCell>{lastUpdateStr}</UpdateCell>
    </TableRow>
  );
};
