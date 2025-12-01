import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { views } from 'mylife-tools';
import * as api from '../../api';
import icons from '../../common/icons';
import { SuccessCell, WarningCell, ErrorCell } from '../../common/table-status';

const Container = styled(Paper)(({ theme }) => ({
  display: 'inline-block',
  width: 400,
  margin: theme.spacing(4),
}));

const HeaderCell = styled('div')(({ theme }) => ({
  display: 'flex',
  '& > *': {
    marginRight: theme.spacing(2),
  },
}));

export interface UpdatesSummaryProps {
  view: views.View<api.UpdatesSummary>;
}

export default function UpdatesSummary({ view }: UpdatesSummaryProps) {
  return (
    <Container>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>
              <HeaderCell>
                <icons.menu.Updates />
                {'Updates'}
              </HeaderCell>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{'Catégorie'}</TableCell>
            <TableCell>{'OK'}</TableCell>
            <TableCell>{'Dépassés'}</TableCell>
            <TableCell>{'Inconnus'}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.values(view).map((data) => (
            <Row key={data._id} data={data} />
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

interface RowProps {
  data: api.UpdatesSummary;
}

function Row({ data }: RowProps) {
  return (
    <TableRow>
      <TableCell>{data.category}</TableCell>
      <SuccessCell>{data.ok}</SuccessCell>
      <WarningCell>{data.outdated}</WarningCell>
      <ErrorCell>{data.unknown}</ErrorCell>
    </TableRow>
  );
}
