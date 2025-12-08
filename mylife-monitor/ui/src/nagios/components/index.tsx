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
import { useMemo } from 'react';
import { useSince } from '../../common/behaviors';
import { SuccessRow, WarningRow, ErrorRow } from '../../common/table-status';
import { useAppDispatch, useAppSelector } from '../../store-api';
import { HOST_STATUS_PROBLEM } from '../problems';
import { changeCriteria, Criteria, getCriteria, getDisplayView } from '../store';
import { useNagiosDataView } from '../views';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useAppDispatch();
  return {
    criteria: useAppSelector(getCriteria),
    data: useAppSelector(getDisplayView),
    ...useMemo(
      () => ({
        changeCriteria: (criteria: Criteria) => dispatch(changeCriteria(criteria)),
      }),
      [dispatch]
    ),
  };
};

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  overflowY: 'auto',
});

interface CommonStateProps {
  item: FIXME_any;
}

function CommonState({ item }: CommonStateProps) {
  const rawDuration = useSince(item.lastStateChange);
  const duration = rawDuration && humanizeDuration(rawDuration, { language: 'fr', largest: 1, round: true });
  return (
    <>
      <TableCell>{formatTimestamp(item.lastCheck)}</TableCell>
      <TableCell>{formatTimestamp(item.nextCheck)}</TableCell>
      <TableCell>{`${item.currentAttempt}/${item.maxAttempts}`}</TableCell>
      <TableCell>{duration}</TableCell>
      <TableCell>{item.statusText}</TableCell>
    </>
  );
}

interface ServiceProps {
  criteria: Criteria;
  service: FIXME_any;
  hostDisplay: FIXME_any;
}

function Service({ criteria, service, hostDisplay }: ServiceProps) {
  const RowComponent = getServiceRowComponent(service.status);
  return (
    <RowComponent>
      <TableCell />
      <TableCell>{criteria.onlyProblems && hostDisplay}</TableCell>
      <TableCell>{service.display}</TableCell>
      <TableCell>{formatStatus(service)}</TableCell>
      <CommonState item={service} />
    </RowComponent>
  );
}

interface HostProps {
  criteria: Criteria;
  item: FIXME_any;
}

function Host({ criteria, item }: HostProps) {
  const { host, services } = item;
  const RowComponent = getHostRowComponent(host.status);
  const displayRow = !criteria.onlyProblems || HOST_STATUS_PROBLEM[host.status];
  return (
    <>
      {displayRow && (
        <RowComponent>
          <TableCell />
          <TableCell>{host.display}</TableCell>
          <TableCell />
          <TableCell>{formatStatus(host)}</TableCell>
          <CommonState item={host} />
        </RowComponent>
      )}
      {services.map((service) => (
        <Service key={service._id} criteria={criteria} service={service} hostDisplay={host.display} />
      ))}
    </>
  );
}

interface GroupProps {
  criteria: FIXME_any;
  item: FIXME_any;
}

function Group({ criteria, item }: GroupProps) {
  return (
    <>
      <TableRow>
        <TableCell>{item.group.display}</TableCell>
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
      </TableRow>
      {item.hosts.map((child) => (
        <Host key={child.host._id} criteria={criteria} item={child} />
      ))}
    </>
  );
}

export default function Nagios() {
  useNagiosDataView();
  const { data, criteria, changeCriteria } = useConnect();

  return (
    <Container>
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{'Groupe'}</TableCell>
              <TableCell>{'Hôte'}</TableCell>
              <TableCell>{'Service'}</TableCell>
              <TableCell>
                {'Statut'}
                <Tooltip title={"N'afficher que les problèmes"}>
                  <Checkbox color="primary" checked={criteria.onlyProblems} onChange={(e) => changeCriteria({ onlyProblems: e.target.checked })} />
                </Tooltip>
              </TableCell>
              <TableCell>{'Dernier check'}</TableCell>
              <TableCell>{'Prochain check'}</TableCell>
              <TableCell>{'Essai'}</TableCell>
              <TableCell>{'Durée'}</TableCell>
              <TableCell>{'Texte'}</TableCell>
            </TableRow>
          </TableHead>
          <ThemeProvider theme={createTheme({ typography: { fontSize: 10 } })}>
            <TableBody>
              {data.map((item) => (
                <Group key={item.group._id} criteria={criteria} item={item} />
              ))}
            </TableBody>
          </ThemeProvider>
        </Table>
      </TableContainer>
    </Container>
  );
}

function formatStatus(item) {
  let value = item.status.toUpperCase();
  if (item.isFlapping) {
    value += ' (instable)';
  }
  return value;
}

function formatTimestamp(date) {
  const today = new Date();
  const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();

  return formatDate(date, isToday ? 'HH:mm:ss' : 'dd/MM/yyyy HH:mm:ss');
}

const HOST_STATUS_COMPONENTS = {
  pending: TableRow,
  up: SuccessRow,
  down: ErrorRow,
  unreachable: ErrorRow,
};

const SERVICE_STATUS_COMPONENTS = {
  pending: TableRow,
  ok: SuccessRow,
  warning: WarningRow,
  unknown: ErrorRow,
  critical: ErrorRow,
};

function getHostRowComponent(status) {
  return HOST_STATUS_COMPONENTS[status] || TableRow;
}

function getServiceRowComponent(status) {
  return SERVICE_STATUS_COMPONENTS[status] || TableRow;
}
