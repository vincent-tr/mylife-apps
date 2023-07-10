import { React, mui, useLifecycle, useActions, useSelector } from 'mylife-tools-ui';
import { enter, leave, setMode } from '../actions';
import { getState } from '../selectors';
import { TeslaChargingStatus, TeslaDeviceStatus, TeslaMode } from '../../../../shared/metadata';
import icons from '../../common/icons';

const useStyles = mui.makeStyles(theme => ({
  buttonGroup: {
    margin: theme.spacing(2),
  },
  success: {
    color: theme.palette.success.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  error: {
    color: theme.palette.error.main,
  },
}));

const Tesla: React.FunctionComponent = () => {
  useViewLifecycle();

  const state = useSelector(state => getState(state));
  const actions = useActions({ setMode });

  const classes = useStyles();

  if (!state) {
    return null;
  }
  
  return (
    <div>

      <mui.ToggleButtonGroup exclusive value={state.mode} onChange={(event, mode) => actions.setMode(mode)} className={classes.buttonGroup}>
        <mui.ToggleButton value={TeslaMode.Off}>
          <mui.Tooltip title='Eteint'>
            <icons.actions.Off fontSize='large'/>
          </mui.Tooltip>
        </mui.ToggleButton>

        <mui.ToggleButton value={TeslaMode.Fast}>
          <mui.Tooltip title='Rapide'>
            <icons.actions.Fast fontSize='large'/>
          </mui.Tooltip>
        </mui.ToggleButton>

        <mui.ToggleButton value={TeslaMode.Smart}>
          <mui.Tooltip title='Intelligent'>
            <icons.actions.Smart fontSize='large'/>
          </mui.Tooltip>
        </mui.ToggleButton>
      </mui.ToggleButtonGroup>

      <mui.Table size='small' stickyHeader>
        <mui.TableBody>
          <Item title='Batterie' value={<BatteryStatus level={state.batteryLevel} targetLevel={state.batteryTargetLevel} lastUpdate={state.batteryLastTimestamp} />} />
          <Item title='Chargement' value={<ChargeStatus current={state.chargingCurrent} power={state.chargingPower} lastUpdate={state.lastUpdate} />} />
          <Item title='Décision de charge' value={getChargingStatusString(state.chargingStatus)} />
          <Item title='Equipements' value={<DevicesStatus wallConnector={state.wallConnectorStatus} car={state.carStatus} lastUpdate={state.lastUpdate} />} />
        </mui.TableBody>
      </mui.Table>

    </div>
  );
};

export default Tesla;

const Item: React.FunctionComponent<{title: any, value: any}> = ({ title, value }) => (
  <mui.TableRow>
    <mui.TableCell>{title}</mui.TableCell>
    <mui.TableCell>{value}</mui.TableCell>
  </mui.TableRow>
);

function useViewLifecycle() {
  const actions = useActions({ enter, leave });
  useLifecycle(actions.enter, actions.leave);
}

const DevicesStatus: React.FunctionComponent<{ wallConnector: TeslaDeviceStatus; car: TeslaDeviceStatus; lastUpdate: Date; }> = ({ wallConnector, car, lastUpdate }) => {
  return (
    <LastUpdateTooltip lastUpdate={lastUpdate}>
      <div>
        <mui.Tooltip title={`Wall connector`}>
          <icons.tesla.WallConnector />
        </mui.Tooltip>
        <DeviceStatus value={wallConnector} />

        <mui.Tooltip title={`Voiture`}>
          <icons.tesla.Car />
        </mui.Tooltip>
        <DeviceStatus value={car} />
      </div>
    </LastUpdateTooltip>
  );
};

const DeviceStatus: React.FunctionComponent<{ value: TeslaDeviceStatus; }> = ({ value }) => {
  const classes = useStyles();

  let label: string;
  let Icon: typeof mui.SvgIcon;
  let className: string = null;

  switch (value) {
  case TeslaDeviceStatus.Unknown:
    label = 'Inconnu';
    Icon = icons.deviceStatus.Unknown;
    className = classes.warning;
    break;

  case TeslaDeviceStatus.Online:
    label = 'En ligne';
    Icon = icons.deviceStatus.Online;
    className = classes.success;
    break;

  case TeslaDeviceStatus.Offline:
    label = 'Hors ligne';
    Icon = icons.deviceStatus.Offline;
    className = classes.success;
    break;

  case TeslaDeviceStatus.Failure:
    label = 'Echec';
    Icon = icons.deviceStatus.Failure;
    className = classes.error;
    break;

  default:
    throw new Error(`Unknown status '${value}'`);
  }

  return (
    <mui.Tooltip title={label}>
      <Icon className={className} />
    </mui.Tooltip>
  );
};

const useProgressStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    marginRight: theme.spacing(1),
  },
  label: {
    minWidth: 80,
  },
}));

const ChargeStatus: React.FunctionComponent<{ current: number; power: number; lastUpdate: Date; }> = ({ current, power, lastUpdate }) => {
  const classes = useProgressStyles();
  const MAX_CURRENT = 32; // Note: should be fetched from server
  const ratio = current / MAX_CURRENT * 100;

  if (current <= 0) {
    return (
      <LastUpdateTooltip lastUpdate={lastUpdate}>
        <mui.Typography variant='body2'>{`(Stoppé)`}</mui.Typography>
      </LastUpdateTooltip>
    );
  }

  return (
    <LastUpdateTooltip lastUpdate={lastUpdate}>
      <div className={classes.container}>
        <mui.LinearProgress className={classes.bar} variant='determinate' value={ratio} />
        <mui.Typography className={classes.label} variant='body2' color='textSecondary'>{`${current}A / ${power}kW`}</mui.Typography>
      </div>
    </LastUpdateTooltip>
  );
};

const BatteryStatus: React.FunctionComponent<{ level: number; targetLevel: number; lastUpdate: Date; }> = ({ level, targetLevel, lastUpdate }) => {
  const classes = useProgressStyles();
  return (
    <LastUpdateTooltip lastUpdate={lastUpdate}>
      <div className={classes.container}>
        <mui.LinearProgress className={classes.bar} variant='buffer' value={level} valueBuffer={targetLevel} />
        <mui.Typography className={classes.label} variant='body2' color='textSecondary'>{`${level}% -> ${targetLevel}%`}</mui.Typography>
      </div>
    </LastUpdateTooltip>
  );
};

const LastUpdateTooltip: React.FunctionComponent<{ lastUpdate: Date }> = ({ lastUpdate, children }) => (
  <mui.Tooltip title={`Mise à jour : ${lastUpdate.toLocaleString()}`}>
    {children}
  </mui.Tooltip>
);

function getChargingStatusString(status: TeslaChargingStatus) {
  switch (status) {
  case TeslaChargingStatus.Unknown:
    return 'Inconnu';
  case TeslaChargingStatus.Charging:
    return 'En charge';
  case TeslaChargingStatus.Complete:
    return 'Charge terminée';
  case TeslaChargingStatus.NotAtHome:
    return 'Voiture pas à la maison';
  case TeslaChargingStatus.NotPlugged:
    return 'Voiture pas branchée';
  case TeslaChargingStatus.NoPower:
    return 'Pas de puissance disponible';
  case TeslaChargingStatus.Disabled:
    return 'Désactivé';
  default:
    return `${status}`;
  }
}
