import BatteryGauge from 'react-battery-gauge';
import { styled, Typography, Divider, Tooltip, IconButton, SvgIcon, ToggleButton, ToggleButtonGroup } from '@mui/material';
import humanizeDuration from 'humanize-duration';
import React, { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { useLifecycle, useActions } from 'mylife-tools-ui';
import { enter, leave, setMode } from '../actions';
import { getState } from '../selectors';
import { TeslaChargingStatus, TeslaDeviceStatus, TeslaMode } from '../../../../shared/metadata';
import icons from '../../common/icons';
import ChargingGauge from './charging-gauge';
import { useParameters } from './parameters';

const Tesla: React.FC = () => {
  useViewLifecycle();

  const state = useSelector((state) => getState(state));
  const actions = useActions({ setMode });
  const showParameters = useParameters();

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
          <Typography variant="body2" color="textSecondary">
            {`Cible de chargement : ${state.batteryTargetLevel}%`}
            <br />
            {`Dernière mise à jour : ${state.batteryLastTimestamp.toLocaleString()}`}
          </Typography>
        </Part>
      </Section>

      <Divider />

      <Section title={'Charge'}>
        <Part>
          <ButtonsContainer>
            <StyledToggleButtonGroup exclusive value={state.mode} onChange={(event, mode) => actions.setMode(mode)}>
              <ToggleButton value={TeslaMode.Off}>
                <Tooltip title="Eteint">
                  <icons.actions.Off fontSize="large" />
                </Tooltip>
              </ToggleButton>

              <ToggleButton value={TeslaMode.Fast}>
                <Tooltip title="Rapide">
                  <icons.actions.Fast fontSize="large" />
                </Tooltip>
              </ToggleButton>

              <ToggleButton value={TeslaMode.Smart}>
                <Tooltip title="Intelligent">
                  <icons.actions.Smart fontSize="large" />
                </Tooltip>
              </ToggleButton>
            </StyledToggleButtonGroup>

            <IconButton onClick={showParameters}>
              <Tooltip title="Paramètres">
                <icons.actions.Settings fontSize="large" />
              </Tooltip>
            </IconButton>
          </ButtonsContainer>

          <ChargeStatus current={state.chargingCurrent} power={state.chargingPower} />
        </Part>

        <Part footer>
          <Typography variant="body2" color="textSecondary">
            {`Décision de charge : ${getChargingStatusString(state.chargingStatus)}`}
            <br />
            {state.mode == TeslaMode.Fast && state.chargingStatus == TeslaChargingStatus.Charging && (
              <>
                {`Temps restant : ${humanizeDuration(state.chargingTimeLeft * 60 * 1000, { language: 'fr' })}`}
                <br />
              </>
            )}
            {`Dernière mise à jour : ${state.lastUpdate.toLocaleString()}`}
          </Typography>

          <Spacer />

          <Tooltip title={`Wall connector`}>
            <icons.tesla.WallConnector />
          </Tooltip>
          <DeviceStatus value={state.wallConnectorStatus} />

          <Spacer />

          <Tooltip title={`Voiture`}>
            <icons.tesla.Car />
          </Tooltip>
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

const ButtonsContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const SectionRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

const Section: React.FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => {
  return (
    <SectionRoot>
      <SectionTitle variant="h1">{title}</SectionTitle>

      {children}
    </SectionRoot>
  );
};

const PartFooter = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const PartContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  margin: theme.spacing(1),
}));

const Part: React.FC<PropsWithChildren<{ footer?: boolean }>> = ({ footer = false, children }) => {
  const content = footer ? <PartFooter>{children}</PartFooter> : children;

  return <PartContainer>{content}</PartContainer>;
};

const Spacer = styled('div')(({ theme }) => ({
  height: 1,
  width: theme.spacing(3),
}));

const StatusUnknownIcon = styled(icons.deviceStatus.Unknown)(({ theme }) => ({
  color: theme.palette.warning.main,
}));

const StatusUnknown: React.FC = () => (
  <Tooltip title={'Inconnu'}>
    <StatusUnknownIcon />
  </Tooltip>
);

const StatusOnlineIcon = styled(icons.deviceStatus.Online)(({ theme }) => ({
  color: theme.palette.success.main,
}));

const StatusOnline: React.FC = () => (
  <Tooltip title={'En ligne'}>
    <StatusOnlineIcon />
  </Tooltip>
);

const StatusOfflineIcon = styled(icons.deviceStatus.Offline)(({ theme }) => ({
  color: theme.palette.success.main,
}));

const StatusOffline: React.FC = () => (
  <Tooltip title={'Hors ligne'}>
    <StatusOfflineIcon />
  </Tooltip>
);

const StatusFailureIcon = styled(icons.deviceStatus.Failure)(({ theme }) => ({
  color: theme.palette.error.main,
}));

const StatusFailure: React.FC = () => (
  <Tooltip title={'Echec'}>
    <StatusFailureIcon />
  </Tooltip>
);

const DeviceStatus: React.FC<{ value: TeslaDeviceStatus }> = ({ value }) => {
  switch (value) {
    case TeslaDeviceStatus.Unknown:
      return <StatusUnknown />;
    case TeslaDeviceStatus.Online:
      return <StatusOnline />;
    case TeslaDeviceStatus.Offline:
      return <StatusOffline />;
    case TeslaDeviceStatus.Failure:
      return <StatusFailure />;
    default:
      throw new Error(`Unknown status '${value}'`);
  }
};

const ChargeStatus: React.FC<{ current: number; power: number }> = ({ current, power }) => {
  const MAX_CURRENT = 32; // Note: should be fetched from server

  if (current <= 0) {
    return <Typography variant="body2">{`(Stoppé)`}</Typography>;
  }

  return <ChargingGauge height={100} width={100} min={0} max={MAX_CURRENT} value={current} minText="0A" maxText={`${MAX_CURRENT}A`} valueText={`${current}A / ${power}kW`} />;
};

export const BatteryStatus: React.FC<{ level: number }> = ({ level }) => {
  // TODO: pick from theme
  const COLOR_PRIMARY = '#2196f3';

  return (
    <BatteryGauge
      orientation="vertical"
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
          fontSize: '1rem' as any,
        },
      }}
    />
  );
};

function getChargingStatusString(status: TeslaChargingStatus) {
  switch (status) {
    case TeslaChargingStatus.Unknown:
      return 'Inconnu';
    case TeslaChargingStatus.Charging:
      return 'En charge';
    case TeslaChargingStatus.Complete:
      return 'Charge terminée';
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
