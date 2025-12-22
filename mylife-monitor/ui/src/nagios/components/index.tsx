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
import { useCallback, useState } from 'react';
import { NagiosHost, NagiosHostStatus, NagiosService, NagiosServiceStatus } from '../../api';
import { useSince } from '../../common/behaviors';
import { SuccessRow, WarningRow, ErrorRow } from '../../common/table-status';
import { useAppSelector } from '../../store-api';
import { HOST_STATUS_PROBLEM } from '../problems';
import { getDisplayView, GroupWithHosts, HostWithServices } from '../store';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  overflowY: 'auto',
});

interface CommonStateProps {
  item: NagiosHost | NagiosService;
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
  onlyProblems: boolean;
  service: NagiosService;
  hostDisplay: string;
}

function Service({ onlyProblems, service, hostDisplay }: ServiceProps) {
  const RowComponent = getServiceRowComponent(service.status);
  return (
    <RowComponent>
      <TableCell />
      <TableCell>{onlyProblems && hostDisplay}</TableCell>
      <TableCell>{service.display}</TableCell>
      <TableCell>{formatStatus(service)}</TableCell>
      <CommonState item={service} />
    </RowComponent>
  );
}

interface HostProps {
  onlyProblems: boolean;
  item: HostWithServices;
}

function Host({ onlyProblems, item }: HostProps) {
  const { host, services } = item;
  const RowComponent = getHostRowComponent(host.status);
  const displayRow = !onlyProblems || HOST_STATUS_PROBLEM[host.status];
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
        <Service key={service._id} onlyProblems={onlyProblems} service={service} hostDisplay={host.display} />
      ))}
    </>
  );
}

interface GroupProps {
  onlyProblems: boolean;
  item: GroupWithHosts;
}

function Group({ onlyProblems, item }: GroupProps) {
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
        <Host key={child.host._id} onlyProblems={onlyProblems} item={child} />
      ))}
    </>
  );
}

export default function Nagios() {
  const [onlyProblems, setOnlyProblems] = useState(true);
  const data = useAppSelector(state => getDisplayView(state, onlyProblems));

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOnlyProblems(e.target.checked);
    },
    [setOnlyProblems]
  );

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
                  <Checkbox color="primary" checked={onlyProblems} onChange={onChange} />
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
                <Group key={item.group._id} onlyProblems={onlyProblems} item={item} />
              ))}
            </TableBody>
          </ThemeProvider>
        </Table>
      </TableContainer>
    </Container>
  );
}

function formatStatus(item: NagiosHost | NagiosService) {
  let value = item.status.toUpperCase();
  if (item.isFlapping) {
    value += ' (instable)';
  }
  return value;
}

function formatTimestamp(date: Date) {
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

function getHostRowComponent(status: NagiosHostStatus) {
  return HOST_STATUS_COMPONENTS[status] || TableRow;
}

function getServiceRowComponent(status: NagiosServiceStatus) {
  return SERVICE_STATUS_COMPONENTS[status] || TableRow;
}
