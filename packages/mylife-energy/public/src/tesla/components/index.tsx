import { React, mui, useLifecycle, useActions, useSelector } from 'mylife-tools-ui';
import { enter, leave, setMode } from '../actions';
import { getState } from '../selectors';
import { TeslaChargingStatus, TeslaDeviceStatus, TeslaMode } from '../../../../shared/metadata';
import icons from '../../common/icons';

const Tesla: React.FunctionComponent = () => {
  useViewLifecycle();

  const state = useSelector(state => getState(state));
  const actions = useActions({ setMode });

  if (!state) {
    return null;
  }
  
  return (
    <div>
      <mui.Table size='small' stickyHeader>
        <mui.TableBody>
          <Item title='Mode' value={getModeString(state.mode)} />
          <Item title='Last update' value={state.lastUpdate.toLocaleString()} />
          <Item title='Wall connector status' value={getDeviceStatusString(state.wallConnectorStatus)} />
          <Item title='Car status' value={getDeviceStatusString(state.carStatus)} />
          <Item title='Charging status' value={getChargingStatusString(state.chargingStatus)} />
          <Item title='Charging current' value={state.chargingCurrent} />
          <Item title='Charging power' value={state.chargingPower} />
          <Item title='Battery last update' value={state.batteryLastTimestamp.toLocaleString()} />
          <Item title='Battery level' value={state.batteryLevel} />
          <Item title='Battery target level' value={state.batteryTargetLevel} />
        </mui.TableBody>
      </mui.Table>

      <mui.ToggleButtonGroup exclusive value={state.mode} onChange={(event, mode) => actions.setMode(mode)}>
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
    </div>
  );
};

export default Tesla;

const Item: React.FunctionComponent<{title: string, value: any}> = ({ title, value }) => (
  <mui.TableRow>
    <mui.TableCell>{title}</mui.TableCell>
    <mui.TableCell>{value}</mui.TableCell>
  </mui.TableRow>
);

function useViewLifecycle() {
  const actions = useActions({ enter, leave });
  useLifecycle(actions.enter, actions.leave);
}

function getModeString(mode: TeslaMode) {
  switch (mode) {
  case TeslaMode.Off:
    return "Eteint";
  case TeslaMode.Fast:
    return "Rapide";
  case TeslaMode.Smart:
    return "Intelligent";
  default:
    return `${mode}`;
  }
}

function getDeviceStatusString(status: TeslaDeviceStatus) {
  switch (status) {
  case TeslaDeviceStatus.Unknown:
    return 'Inconnu';
  case TeslaDeviceStatus.Online:
    return 'En ligne';
  case TeslaDeviceStatus.Offline:
    return 'Hors ligne';
  case TeslaDeviceStatus.Failure:
    return 'Echec';
  default:
    return `${status}`;
  }
}

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
