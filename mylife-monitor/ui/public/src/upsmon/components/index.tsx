import React, { useMemo } from 'react';
import { format as formatDate } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { mui, useLifecycle } from 'mylife-tools-ui';
import humanizeDuration from 'humanize-duration';
import { metadata } from 'mylife-tools-common';
import { useStatusColorStyles } from '../../common/status-colors';
import { useSince } from '../../common/behaviors';
import { enter, leave } from '../actions';
import { getView } from '../selectors';

type FIXME_any = any;

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
  }
}));

const Upsmon = () => {
  const classes = useStyles();
  const { enter, leave, data } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      <mui.TableContainer>
        <mui.Table size='small' stickyHeader>
          <mui.TableHead>
            <mui.TableRow>
              <mui.TableCell>{'Onduleur'}</mui.TableCell>
              <mui.TableCell>{'Nom'}</mui.TableCell>
              <mui.TableCell>{'Valeur'}</mui.TableCell>
            </mui.TableRow>
          </mui.TableHead>
          <mui.ThemeProvider theme={mui.createTheme({ typography: { fontSize: 10 } })}>
            <mui.TableBody>
              {data.valueSeq().map(item => (
                <Ups key={item._id} data={item} />
              ))}
            </mui.TableBody>
          </mui.ThemeProvider>
        </mui.Table>
      </mui.TableContainer>
    </div>
  );
}

export default Upsmon;

const EXCLUDED_FIELDS = ['_id', 'upsName'];

const Ups = ({ data }) => {
  const classes = useStatusColorStyles();
  const lastUpdate = useSince(data.date);

  const isOk = data.status === 'ONLINE' && lastUpdate < 5 * 60 * 1000; // 5 mins
  const entity = metadata.getEntity(data._entity);

  return (
    <>
      <mui.TableRow className={isOk ? classes.success : classes.error}>
        <mui.TableCell>{data.upsName}</mui.TableCell>
        <mui.TableCell />
        <mui.TableCell />
      </mui.TableRow>
      {entity.fields
        .filter(field => !EXCLUDED_FIELDS.includes(field.id))
        .map(field => (
        <Item key={field.id} data={data} field={field} />
      ))}
    </>
  );
};

const Item = ({ data, field }) => {
  return (
    <mui.TableRow>
      <mui.TableCell />
      <mui.TableCell>{field.name}</mui.TableCell>
      <mui.TableCell>{formatValue(data, field)}</mui.TableCell>
    </mui.TableRow>
  );
};

function useConnect() {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector(state => ({
      data: getView(state)
    })),
    ...useMemo(() => ({
      enter: () => dispatch(enter()),
      leave: () => dispatch(leave()),
    }), [dispatch])
  };
};

function formatValue(data, field) {
  const datatype = field.datatype;
  const value = field.getValue(data);

  if (value === null) {
    return '';
  }

  switch (datatype.id) {
  
  case 'name':
  case 'text':
    return value;
  
  case 'datetime':
    return formatDate(value, 'dd/MM/yyyy HH:mm:ss');
  case 'duration':
    return humanizeDuration(value * 1000, { language: 'fr', largest: 1, round: true });
  case 'percent':
    return `${value.toFixed()} %`;
  case 'voltage':
    return `${value.toFixed()} V`;
  case 'power':
    return `${value.toFixed()} W`;
  case 'count':
    return value.toFixed();

  case 'upsmon-status-flag':
    return formatStatusFlag(value);
    
  default:
    return `Unhandled type ${datatype.id} with value ${JSON.stringify(value)}`;
  }
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

  return values.map(value => value.name).join(', ');
}