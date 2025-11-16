import humanizeDuration from 'humanize-duration';
import React, { useMemo } from 'react';
import { format as formatDate } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { useLifecycle } from 'mylife-tools-ui';
import { successColor, warningColor, errorColor } from '../../common/status-colors';
import { useSince } from '../../common/behaviors';
import { enter, leave } from '../actions';
import { changeCriteria, getCriteria, getDisplayView } from '../store';
import { HOST_STATUS_PROBLEM } from '../problems';
import { styled, TableCell, TableRow, TableContainer, Table, TableHead, Tooltip, Checkbox, ThemeProvider, TableBody, createTheme } from '@mui/material';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    criteria: useSelector(getCriteria),
    data: useSelector(getDisplayView),
    ...useMemo(() => ({
      enter: () => dispatch(enter()),
      leave: () => dispatch(leave()),
      changeCriteria: (criteria) => dispatch(changeCriteria(criteria)),
    }), [dispatch])
  };
};

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  overflowY: 'auto',
});

const SuccessRow = styled(TableRow)(({ theme }) => successColor(theme));
const WarningRow = styled(TableRow)(({ theme }) => warningColor(theme));
const ErrorRow = styled(TableRow)(({ theme }) => errorColor(theme));

const SuccessCell = styled(TableCell)(({ theme }) => successColor(theme));
const WarningCell = styled(TableCell)(({ theme }) => warningColor(theme));
const ErrorCell = styled(TableCell)(({ theme }) => errorColor(theme));

const CommonState = ({ item }) => {
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
};

const Service = ({ criteria, service, hostDisplay }) => {
  const { RowComponent, CellComponent } = getServiceStatusComponents(service.status);
  return (
    <RowComponent>
      <TableCell />
      <TableCell>{criteria.onlyProblems && hostDisplay}</TableCell>
      <TableCell>{service.display}</TableCell>
      <CellComponent>{formatStatus(service)}</CellComponent>
      <CommonState item={service} />
    </RowComponent>
  );
};

const Host = ({ criteria, item }) => {
  const { host, services } = item;
  const { RowComponent, CellComponent } = getHostStatusComponents(host.status);
  const displayRow = !criteria.onlyProblems || HOST_STATUS_PROBLEM[host.status];
  return (
    <>
      {displayRow && (
        <RowComponent>
          <TableCell />
          <TableCell>{host.display}</TableCell>
          <TableCell />
          <CellComponent>{formatStatus(host)}</CellComponent>
          <CommonState item={host} />
        </RowComponent>
      )}
      {services.map(service => (
        <Service key={service._id} criteria={criteria} service={service} hostDisplay={host.display} />
      ))}
    </>
  );
};

const Group = ({ criteria, item }) => (
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
    {item.hosts.map(child => (
      <Host key={child.host._id} criteria={criteria} item={child} />
    ))}
  </>
);

const Nagios = () => {
  const { enter, leave, data, criteria, changeCriteria } = useConnect();
  useLifecycle(enter, leave);

  return (
    <Container>
      <TableContainer>
        <Table size='small' stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{'Groupe'}</TableCell>
              <TableCell>{'Hôte'}</TableCell>
              <TableCell>{'Service'}</TableCell>
              <TableCell>
                {'Statut'}
                <Tooltip title={'N\'afficher que les problèmes'}>
                  <Checkbox
                    color='primary' 
                    checked={criteria.onlyProblems}
                    onChange={e => changeCriteria({ onlyProblems: e.target.checked })}
                  />
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
              {data.map(item => (
                <Group key={item.group._id} criteria={criteria} item={item} />
              ))}
            </TableBody>
          </ThemeProvider>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Nagios;

function formatStatus(item) {
  let value = item.status.toUpperCase();
  if(item.isFlapping) {
    value += ' (instable)';
  }
  return value;
}

function formatTimestamp(date) {
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return formatDate(date, isToday ? 'HH:mm:ss' : 'dd/MM/yyyy HH:mm:ss');
}

const HOST_STATUS_COMPONENTS = {
  pending: { RowComponent: TableRow, CellComponent: TableCell },
  up: { RowComponent: SuccessRow, CellComponent: SuccessCell },
  down: { RowComponent: ErrorRow, CellComponent: ErrorCell },
  unreachable: { RowComponent: ErrorRow, CellComponent: ErrorCell },
};

const SERVICE_STATUS_COMPONENTS = {
  pending: { RowComponent: TableRow, CellComponent: TableCell },
  ok: { RowComponent: SuccessRow, CellComponent: SuccessCell },
  warning: { RowComponent: WarningRow, CellComponent: WarningCell },
  unknown: { RowComponent: ErrorRow, CellComponent: ErrorCell },
  critical: { RowComponent: ErrorRow, CellComponent: ErrorCell },
};

function getHostStatusComponents(status) {
  return HOST_STATUS_COMPONENTS[status] || { RowComponent: TableRow, CellComponent: TableCell };
}

function getServiceStatusComponents(status) {
  return SERVICE_STATUS_COMPONENTS[status] || { RowComponent: TableRow, CellComponent: TableCell };
}