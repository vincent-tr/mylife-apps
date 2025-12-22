import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { format as formatDate } from 'date-fns';
import humanizeDuration from 'humanize-duration';
import { NagiosHost, NagiosHostStatus, NagiosService, NagiosServiceStatus } from '../../api';
import { useSince } from '../../common/behaviors';
import { SuccessRow, WarningRow, ErrorRow } from '../../common/table-status';
import { useAppSelector } from '../../store-api';
import { HOST_STATUS_PROBLEM } from '../store';
import { getDisplayView, GroupWithHosts, HostWithServices } from '../store';

export interface NagiosProps {
  summary: boolean;
}

export default function Nagios({ summary = false }: NagiosProps) {
  const data = useAppSelector(state => getDisplayView(state, summary));

  return (
    <Container>
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{'Groupe'}</TableCell>
              <TableCell>{'Hôte'}</TableCell>
              <TableCell>{'Service'}</TableCell>
              <TableCell>{'Statut'}</TableCell>
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
                <Group key={item.group._id} summary={summary} item={item} />
              ))}
            </TableBody>
          </ThemeProvider>
        </Table>
      </TableContainer>
    </Container>
  );
}

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  overflowY: 'auto',
});

interface GroupProps {
  summary: boolean;
  item: GroupWithHosts;
}

function Group({ summary, item }: GroupProps) {
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
        <Host key={child.host._id} summary={summary} item={child} />
      ))}
    </>
  );
}

interface HostProps {
  summary: boolean;
  item: HostWithServices;
}

function Host({ summary, item }: HostProps) {
  const { host, services } = item;
  const RowComponent = getHostRowComponent(host.status);
  const displayRow = !summary || HOST_STATUS_PROBLEM[host.status];
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
        <Service key={service._id} summary={summary} service={service} hostDisplay={host.display} />
      ))}
    </>
  );
}

interface ServiceProps {
  summary: boolean;
  service: NagiosService;
  hostDisplay: string;
}

function Service({ summary, service, hostDisplay }: ServiceProps) {
  const RowComponent = getServiceRowComponent(service.status);
  return (
    <RowComponent>
      <TableCell />
      <TableCell>{summary && hostDisplay}</TableCell>
      <TableCell>{service.display}</TableCell>
      <TableCell>{formatStatus(service)}</TableCell>
      <CommonState item={service} />
    </RowComponent>
  );
}

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
