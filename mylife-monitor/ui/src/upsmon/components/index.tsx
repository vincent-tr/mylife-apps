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
import { useUpsmonDataView } from '../views';

type FIXME_any = any;

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  overflowY: 'auto',
});

export default function Upsmon() {
  const data = useUpsmonDataView();

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
              {Object.values(data).map((item: api.UpsmonStatus) => (
                <Ups key={item._id} data={item} />
              ))}
            </TableBody>
          </ThemeProvider>
        </Table>
      </TableContainer>
    </Container>
  );
}

const formatters = {
  identity: (value) => value,
  datetime: (value) => formatDate(value, 'dd/MM/yyyy HH:mm:ss'),
  duration: (value) => humanizeDuration(value * 1000, { language: 'fr', largest: 1, round: true }),
  percent: (value) => `${value.toFixed()} %`,
  voltage: (value) => `${value.toFixed()} V`,
  power: (value) => `${value.toFixed()} W`,
  count: (value) => value.toFixed(),
  status: formatStatusFlag,
};

const fields: Partial<Record<keyof api.UpsmonStatus, [(value: FIXME_any) => string, string]>> = {
  // _id, _entity
  date: [formatters.datetime, "Date et heure auxquels les informations ont été obtenus de l'onduleur"],
  // upsName
  startTime: [formatters.datetime, "Date/heure de démarrage de l'onduleur"],
  model: [formatters.identity, "Modèle de l'onduleur"],
  status: [formatters.identity, "Statut de l'onduleur"],
  statusFlag: [formatters.status, "Statut de l'onduleur (flags)"],
  lineVoltage: [formatters.voltage, "Tension courante d'entrée"],
  loadPercent: [formatters.percent, 'Pourcentage de puissance utilisée'],
  batteryChargePercent: [formatters.percent, 'Pourcentage de charge des batteries'],
  timeLeft: [formatters.duration, "Temps restant en secondes d'exécution sur batteries"],
  batteryVoltage: [formatters.voltage, 'Tension des batteries'],
  lastTransfer: [formatters.identity, 'Raison du dernier transfert vers les batteries'],
  numberTransfers: [formatters.count, 'Nombre de transferts depuis le démarrage de upsmon'],
  xOnBattery: [formatters.datetime, 'Date/heure du dernier transfert vers les batteries'],
  timeOnBattery: [formatters.duration, 'Temps sur batterie (en secondes)'],
  cumulativeTimeOnBattery: [formatters.duration, 'Temps cumulé sur batterie depuis le démarrage de upsmon (en secondes)'],
  xOffBattery: [formatters.datetime, 'Date/heure du dernier transfert depuis les batteries'],
  nominalInputVoltage: [formatters.voltage, "Tension d'entrée attendue par l'onduleur"],
  nominalBatteryVoltage: [formatters.voltage, 'Tension nominale de batterie'],
  nominalPower: [formatters.power, 'Puissance nominale'],
  firmware: [formatters.identity, 'Version du firmware'],
  outputVoltage: [formatters.voltage, 'Tension de sortie'],
};

interface UpsProps {
  data: api.UpsmonStatus;
}

function Ups({ data }: UpsProps) {
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
        <Item key={field} data={data} field={field} />
      ))}
    </>
  );
}

interface ItemProps {
  data: api.UpsmonStatus;
  field: keyof api.UpsmonStatus;
}

function Item({ data, field }: ItemProps) {
  const [formatter, displayName] = fields[field];
  const value = formatter(data[field]);

  return (
    <TableRow>
      <TableCell />
      <TableCell>{displayName}</TableCell>
      <TableCell>{value}</TableCell>
    </TableRow>
  );
}

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
