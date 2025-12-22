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
import * as api from '../../api';
import { useSince } from '../../common/behaviors';
import { SuccessRow, WarningRow, ErrorRow } from '../../common/table-status';
import { useAppSelector } from '../../store-api';
import { getDisplayView } from '../store';

export interface UpdatesProps {
  summary?: boolean;
}

export default function Updates({ summary = false }: UpdatesProps) {
  const data = useAppSelector(state => getDisplayView(state, summary));

  return (
    <Container>
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{'Nom'}</TableCell>
              <TableCell>{'Etat'}</TableCell>
              <TableCell>{'Version courante'}</TableCell>
              <TableCell>{'Dernière version'}</TableCell>
            </TableRow>
          </TableHead>
          <ThemeProvider theme={createTheme({ typography: { fontSize: 10 } })}>
            <TableBody>
              {data.map((version) => (
                <Version key={version._id} data={version} />
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

interface VersionProps {
  data: api.UpdatesVersion;
}

function Version({ data }: VersionProps) {
  const getRowComponent = (status: api.UpdatesStatus) => {
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
  };

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
