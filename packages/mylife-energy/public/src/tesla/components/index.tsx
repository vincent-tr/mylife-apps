import BatteryGauge from 'react-battery-gauge';
import { React, mui, useLifecycle, useActions, useSelector } from 'mylife-tools-ui';
import { enter, leave, setMode } from '../actions';
import { getState } from '../selectors';
import { TeslaChargingStatus, TeslaDeviceStatus, TeslaMode } from '../../../../shared/metadata';
import icons from '../../common/icons';
import ChargingGauge from './charging-gauge';

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
  section: {
    padding: theme.spacing(2),
  },
  sectionTitle: {
    margin: theme.spacing(2),
  },
  part: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    margin: theme.spacing(1),
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
  },
  spacer: {
    height: 1,
    width: theme.spacing(3),
  }
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
      <Section title={'Batterie'}>

        <Part>
          <BatteryStatus level={state.batteryLevel} />
        </Part>

        <Part>
          <mui.Typography variant='body2' color='textSecondary'>
            {`Cible de chargement : ${state.batteryTargetLevel}%`}
            <br />
            {`Dernière mise à jour : ${state.batteryLastTimestamp.toLocaleString()}`}
          </mui.Typography>
        </Part>

      </Section>

      <mui.Divider />

      <Section title={'Charge'}>

        <Part>
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

          <ChargeStatus current={state.chargingCurrent} power={state.chargingPower} />
        </Part>

        <Part footer>
            <mui.Typography variant='body2' color='textSecondary'>
              {`Décision de charge : ${getChargingStatusString(state.chargingStatus)}`}
              <br />
              {`Dernière mise à jour : ${state.lastUpdate.toLocaleString()}`}
            </mui.Typography>

            <Spacer/>

            <mui.Tooltip title={`Wall connector`}>
              <icons.tesla.WallConnector />
            </mui.Tooltip>
            <DeviceStatus value={state.wallConnectorStatus} />

            <Spacer/>

            <mui.Tooltip title={`Voiture`}>
              <icons.tesla.Car />
            </mui.Tooltip>
            <DeviceStatus value={state.carStatus} />
        </Part>

      </Section>

    </div>
  );
};

export default Tesla;

function useViewLifecycle() {
  const actions = useActions({ enter, leave });
  useLifecycle(actions.enter, actions.leave);
}

const Section: React.FunctionComponent<{ title: string; }> = ({ title, children}) => {
  const classes = useStyles();

  return (
    <div className={classes.section}>
      <mui.Typography variant='h1' className={classes.sectionTitle}>
        {title}
      </mui.Typography>

      {children}
    </div>
  );
};

const Part: React.FunctionComponent<{ footer?: boolean; }> = ({ footer = false, children }) => {
  const classes = useStyles();

  const content = footer ? (
    <div className={classes.footer}>
      {children}
    </div>
  ) : children;

  return (
    <div className={classes.part}>
      {content}
    </div>
  );
};

const Spacer: React.FunctionComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.spacer} />
  )
}

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

const ChargeStatus: React.FunctionComponent<{ current: number; power: number; }> = ({ current, power }) => {
  const MAX_CURRENT = 32; // Note: should be fetched from server

  if (current <= 0) {
    return (
      <mui.Typography variant='body2'>{`(Stoppé)`}</mui.Typography>
    );
  }

  return (
    <ChargingGauge height={100} width={100} min={0} max={MAX_CURRENT} value={current} minText='0A' maxText={`${MAX_CURRENT}A`} valueText={`${current}A / ${power}kW`} />
  );
};

const BatteryStatus: React.FunctionComponent<{ level: number; }> = ({ level }) => {
  // TODO: pick from theme
  const COLOR_PRIMARY = '#2196f3';

  return (
    <BatteryGauge
      orientation='vertical'
      size={100}
      value={level}
      customization={{
        batteryBody: {
          strokeWidth: 2,
        },
        batteryCap: {
          strokeWidth: 2,
        },
        batteryMeter: {
          fill: COLOR_PRIMARY,
          outerGap: 2,
          lowBatteryValue: -1,
        },
        readingText: {
          // From .MuiTypography-body1
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: '1rem',
        },
      }}
    />
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
