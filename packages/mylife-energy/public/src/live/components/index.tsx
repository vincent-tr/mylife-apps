import { React, mui, useSelector, useLifecycle, useActions } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { enter, leave } from '../actions';
import { getMeasureView, getDevice, getFirstDeviceByType, getDevicesByType } from '../selectors';
import { LiveDevice } from '../../../../shared/metadata';
import NodeTable from './node-table';
import { DeviceMeasure } from './common';

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Live = () => {
  useViewLifecycle();

  const main = useSelector(state => getFirstDeviceByType(state, 'main'));
  const solar = useSelector(state => getFirstDeviceByType(state, 'solar'));
  const total = useSelector(state => getFirstDeviceByType(state, 'total'));

  const classes = useStyles();

  return (
    <div className={classes.container}>
      {main && (<DeviceView deviceId={main._id} />)}
      {solar && (<DeviceView deviceId={solar._id} />)}
      {total && (<DeviceView deviceId={total._id} />)}

      <NodeTable />
    </div>
  );
};

export default Live;

const useDeviceStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: 200,
    height: 200,
    alignItems: 'center',
  },
  icon: {
    height: 50,
    width: 50,
  },
}));

const DeviceView: React.FunctionComponent<{ deviceId: string }> = ({ deviceId }) => {
  const classes = useDeviceStyles();
  const device = useSelector(state => getDevice(state, deviceId));

  if (!device) {
    return null;
  }

  const Icon = getIcon(device);

  return (
    <div className={classes.container}>
      <Icon className={classes.icon} />
      <mui.Typography>{device.display}</mui.Typography>
      <DeviceMeasure deviceId={device._id} />
    </div>
  );
};

function getIcon(device: LiveDevice): typeof mui.SvgIcon {
  switch(device.type) {
    case 'main':
      return icons.devices.Main;
    case 'total':
      return icons.devices.Total;
    case 'solar':
      return icons.devices.Solar;
  }

  return null;
}

function useViewLifecycle() {
  const actions = useActions({ enter, leave });
  useLifecycle(actions.enter, actions.leave);
}
