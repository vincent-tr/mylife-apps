import Checkbox from '@mui/material/Checkbox';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { format as formatDate } from 'date-fns';
import humanizeDuration from 'humanize-duration';
import { useCallback, useMemo } from 'react';
import * as api from '../../api';
import { useSince } from '../../common/behaviors';
import { SuccessRow, WarningRow, ErrorRow } from '../../common/table-status';
import { useAppDispatch, useAppSelector } from '../../store';
import { changeCriteria, Criteria, getCriteria, getDisplayView } from '../store';
import { useUpdatesDataView } from '../views';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  overflowY: 'auto',
});

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

export default function Updates() {
  useUpdatesDataView();
  const { data, criteria, changeCriteria } = useConnect();

  const dataSorted = useMemo(() => Object.values(data).sort((a, b) => a.path.join('/').localeCompare(b.path.join('/'))), [data]);

  return (
    <Container>
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{'Nom'}</TableCell>
              <TableCell>
                {'Etat'}
                <Tooltip title={"N'afficher que les dépassés/problèmes"}>
                  <Checkbox color="primary" checked={criteria.onlyProblems} onChange={(e) => changeCriteria({ onlyProblems: e.target.checked })} />
                </Tooltip>
              </TableCell>
              <TableCell>{'Version courante'}</TableCell>
              <TableCell>{'Dernière version'}</TableCell>
            </TableRow>
          </TableHead>
          <ThemeProvider theme={createTheme({ typography: { fontSize: 10 } })}>
            <TableBody>
              {dataSorted.map((version) => (
                <Version key={version._id} data={version} />
              ))}
            </TableBody>
          </ThemeProvider>
        </Table>
      </TableContainer>
    </Container>
  );
}

interface VersionProps {
  data: api.UpdatesVersion;
}

function Version({ data }: VersionProps) {
  const getRowComponent = useCallback((status) => {
    switch (status) {
      case 'uptodate':
        return SuccessRow;
      case 'outdated':
        return WarningRow;
      case 'unknown':
        return ErrorRow;
      default:
        throw new Error(`Unsupported status: '${status}'`);
    }
  }, []);

  const RowComponent = getRowComponent(data.status);

  return (
    <>
      <RowComponent>
        <TableCell>{data.path.join('/')}</TableCell>
        <TableCell>{getStatusStr(data.status)}</TableCell>
        <TableCell>
          <VersionItem value={data.currentVersion} date={data.currentCreated} />
        </TableCell>
        <TableCell>
          <VersionItem value={data.latestVersion} date={data.latestCreated} />
        </TableCell>
      </RowComponent>
    </>
  );
}

function getStatusStr(status: api.UpdatesStatus) {
  switch (status) {
    case 'uptodate':
      return 'A jour';
    case 'outdated':
      return 'Dépassé';
    case 'unknown':
      return 'Inconnu';
    default:
      throw new Error(`Unsupported status: '${status}'`);
  }
}

interface VersionItemProps {
  value: string;
  date: Date;
}

function VersionItem({ value, date }: VersionItemProps) {
  const lastUpdate = useSince(date);

  if (!value) {
    return null;
  }

  const isDateNull = date < new Date(1900);
  const lastUpdateStr = isDateNull ? '' : ` (${formatDuration(lastUpdate)})`;

  const content = (
    <div>
      {value}
      {lastUpdateStr}
    </div>
  );

  if (isDateNull) {
    return content;
  } else {
    return <Tooltip title={formatDate(date, 'dd/MM/yyyy HH:mm:ss')}>{content}</Tooltip>;
  }
}

function useConnect() {
  const dispatch = useAppDispatch();
  return {
    criteria: useAppSelector(getCriteria),
    data: useAppSelector(getDisplayView),
    ...useMemo(
      () => ({
        changeCriteria: (criteria: Partial<Criteria>) => dispatch(changeCriteria(criteria)),
      }),
      [dispatch]
    ),
  };
}
