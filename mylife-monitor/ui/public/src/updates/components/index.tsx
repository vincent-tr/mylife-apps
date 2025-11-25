import React, { useMemo, useCallback } from 'react';
import { format as formatDate } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { views, useLifecycle } from 'mylife-tools-ui';
import humanizeDuration from 'humanize-duration';
import { SuccessRow, WarningRow, ErrorRow } from '../../common/table-status';
import { useSince } from '../../common/behaviors';
import { enter, leave } from '../actions';
import { changeCriteria, getCriteria, getDisplayView } from '../store';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import { styled, ThemeProvider, createTheme } from '@mui/material';

type FIXME_any = any;

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

const Updates = () => {
  const { enter, leave, data, criteria, changeCriteria } = useConnect();
  useLifecycle(enter, leave);

  const dataSorted = useMemo(() => Object.values(data).sort((a, b) => (a as FIXME_any).path.join('/').localeCompare((b as FIXME_any).path.join('/'))) as views.Entity[], [data]);

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
};

export default Updates;

const Version = ({ data }) => {
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
};

function getStatusStr(status) {
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

const VersionItem: React.FC<{ value: string; date: Date }> = ({ value, date }) => {
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
};

function useConnect() {
  const dispatch = useDispatch<FIXME_any>();
  return {
    criteria: useSelector(getCriteria),
    data: useSelector(getDisplayView),
    ...useMemo(
      () => ({
        enter: () => dispatch(enter()),
        leave: () => dispatch(leave()),
        changeCriteria: (criteria) => dispatch(changeCriteria(criteria)),
      }),
      [dispatch]
    ),
  };
}
