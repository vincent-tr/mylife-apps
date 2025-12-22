import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { format as formatDate } from 'date-fns';
import humanizeDuration from 'humanize-duration';
import * as api from '../../api';
import { useSince } from '../../common/behaviors';
import { SuccessRow, ErrorRow } from '../../common/table-status';
import { getView } from '../views';
import { useAppSelector } from '../../store-api';

export interface UpsmonProps {
  summary?: boolean;
}

export default function Upsmon({ summary = false }: UpsmonProps) {
  const data = useAppSelector(getView);

  return (
    <Container>
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{'Onduleur'}</TableCell>
              <TableCell>{'Nom'}</TableCell>
              <TableCell>{'Valeur'}</TableCell>
            </TableRow>
          </TableHead>
          <ThemeProvider theme={createTheme({ typography: { fontSize: 10 } })}>
            <TableBody>
              {Object.values(data).map((item) => (
                <Ups key={item._id} summary={summary} data={item} />
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

interface UpsProps {
  summary: boolean;
  data: api.UpsmonStatus;
}

function Ups({ summary, data }: UpsProps) {
  const lastUpdate = useSince(data.date);

  const isOk = data.status === 'ONLINE' && lastUpdate < 5 * 60 * 1000; // 5 mins
  const RowComponent = isOk ? SuccessRow : ErrorRow;

  return (
    <>
      <RowComponent>
        <TableCell>{data.upsName}</TableCell>
        <TableCell />
        <TableCell />
      </RowComponent>
      {Object.keys(fields).map((field: keyof api.UpsmonStatus) => (
        <Item key={field} summary={summary} data={data} field={field} />
      ))}
    </>
  );
}

interface ItemProps {
  summary: boolean;
  data: api.UpsmonStatus;
  field: keyof api.UpsmonStatus;
}

function Item({ summary, data, field }: ItemProps) {
  const [formatter, displayName, summaryShow] = fields[field];
  const value = formatter(data[field]);

  if (summary && !summaryShow) {
    return null;
  }

  return (
    <TableRow>
      <TableCell />
      <TableCell>{displayName}</TableCell>
      <TableCell>{value}</TableCell>
    </TableRow>
  );
}

const formatters = {
  string: (value: string) => value,
  datetime: (value: Date) => formatDate(value, 'dd/MM/yyyy HH:mm:ss'),
  duration: (value: number) => humanizeDuration(value * 1000, { language: 'fr', largest: 1, round: true }),
  percent: (value: number) => `${value.toFixed()} %`,
  voltage: (value: number) => `${value.toFixed()} V`,
  power: (value: number) => `${value.toFixed()} W`,
  count: (value: number) => value.toFixed(),
  status: formatStatusFlag,
};

const fields: Partial<Record<keyof api.UpsmonStatus, [(value: unknown) => string, string, boolean]>> = {
  // _id, _entity
  date: [formatters.datetime, "Date et heure auxquels les informations ont été obtenus de l'onduleur", true],
  // upsName
  startTime: [formatters.datetime, "Date/heure de démarrage de l'onduleur", false],
  model: [formatters.string, "Modèle de l'onduleur", true],
  status: [formatters.string, "Statut de l'onduleur", false],
  statusFlag: [formatters.status, "Statut de l'onduleur (flags)", true],
  lineVoltage: [formatters.voltage, "Tension courante d'entrée", false],
  loadPercent: [formatters.percent, 'Pourcentage de puissance utilisée', true],
  batteryChargePercent: [formatters.percent, 'Pourcentage de charge des batteries', true],
  timeLeft: [formatters.duration, "Temps restant en secondes d'exécution sur batteries", true],
  batteryVoltage: [formatters.voltage, 'Tension des batteries', false],
  lastTransfer: [formatters.string, 'Raison du dernier transfert vers les batteries', false],
  numberTransfers: [formatters.count, 'Nombre de transferts depuis le démarrage de upsmon', false],
  xOnBattery: [formatters.datetime, 'Date/heure du dernier transfert vers les batteries', false],
  timeOnBattery: [formatters.duration, 'Temps sur batterie (en secondes)', false],
  cumulativeTimeOnBattery: [formatters.duration, 'Temps cumulé sur batterie depuis le démarrage de upsmon (en secondes)', false],
  xOffBattery: [formatters.datetime, 'Date/heure du dernier transfert depuis les batteries', false],
  nominalInputVoltage: [formatters.voltage, "Tension d'entrée attendue par l'onduleur", false],
  nominalBatteryVoltage: [formatters.voltage, 'Tension nominale de batterie', false],
  nominalPower: [formatters.power, 'Puissance nominale', false],
  firmware: [formatters.string, 'Version du firmware', false],
  outputVoltage: [formatters.voltage, 'Tension de sortie', false],
};

interface StatusFlagValue {
  value: number;
  name: string;
  description: string;
}

const STATUS_FLAG_VALUES: StatusFlagValue[] = [
  { value: 0x00000001, name: 'Calibration', description: '' },
  { value: 0x00000002, name: 'Trim', description: '' },
  { value: 0x00000004, name: 'Boost', description: '' },
  { value: 0x00000008, name: 'Online', description: '' },
  { value: 0x00000010, name: 'Onbatt', description: '' },
  { value: 0x00000020, name: 'Overload', description: '' },
  { value: 0x00000040, name: 'Battlow', description: '' },
  { value: 0x00000080, name: 'Replacebatt', description: '' },

  // Extended bit values added by apcupsd

  { value: 0x00000100, name: 'Commlost', description: 'Communications with UPS lost' },
  { value: 0x00000200, name: 'Shutdown', description: 'Shutdown in progress' },
  { value: 0x00000400, name: 'Slave', description: 'Set if this is a slave' },
  { value: 0x00000800, name: 'Slavedown', description: 'Slave not responding' },
  { value: 0x00020000, name: 'Onbatt_msg', description: 'Set when UPS_ONBATT message is sent' },
  { value: 0x00040000, name: 'Fastpoll', description: 'Set on power failure to poll faster' },
  { value: 0x00080000, name: 'ShutLoad', description: 'Set when BatLoad <= percent' },
  { value: 0x00100000, name: 'ShutBtime', description: 'Set when time on batts > maxtime' },
  { value: 0x00200000, name: 'ShutLtime', description: 'Set when TimeLeft <= runtime' },
  { value: 0x00400000, name: 'ShutEmerg', description: 'Set when battery power has failed' },
  { value: 0x00800000, name: 'ShutRemote', description: 'Set when remote shutdown' },
  { value: 0x01000000, name: 'Plugged', description: 'Set if computer is plugged into UPS' },
  { value: 0x04000000, name: 'Battpresent', description: 'Indicates if battery is connected' },
];

function formatStatusFlag(value: number): string {
  const values: StatusFlagValue[] = [];

  for (const candidate of STATUS_FLAG_VALUES) {
    if (candidate.value & value) {
      values.push(candidate);
    }
  }

  return values.map((value) => value.name).join(', ');
}
