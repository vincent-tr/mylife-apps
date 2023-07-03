import { React, mui, useMemo, useDispatch, useSelector, useLifecycle, views, clsx } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { enter, leave } from '../actions';
import { getDeviceView, getMeasureView } from '../selectors';
import { Measure, LiveDevice, DeviceType } from '../../../../shared/metadata';

type FIXME_any = any;

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

const Live = () => {
  const { enter, leave, devices, measures } = useConnect();
  useLifecycle(enter, leave);
  const classes = useStyles();

  const main = findDeviceByType(devices, 'main');
  const solar = findDeviceByType(devices, 'solar');
  const total = findDeviceByType(devices, 'total');
  const nodes = filterDeviceByType(devices, 'node');

      /*
      <mui.TableContainer>
        <mui.Table size='small' stickyHeader>
          <mui.TableHead>
            <mui.TableRow>
              <mui.TableCell>{'Display'}</mui.TableCell>
              <mui.TableCell>{'Type'}</mui.TableCell>
              <mui.TableCell>{'Computed'}</mui.TableCell>
              <mui.TableCell>{'Update'}</mui.TableCell>
              <mui.TableCell>{'Sensors'}</mui.TableCell>
            </mui.TableRow>
          </mui.TableHead>
          <mui.TableBody>
            {devices.valueSeq().sortBy(item => item._id).map(item => (
              <mui.TableRow key={item._id}>
                <mui.TableCell>{item.display}</mui.TableCell>
                <mui.TableCell>{item.type}</mui.TableCell>
                <mui.TableCell>{item.computed ? 'Yes' : 'No'}</mui.TableCell>
                <mui.TableCell>{formatUpdate(item, measures)}</mui.TableCell>
                <mui.TableCell>{formatSensors(item, measures)}</mui.TableCell>
              </mui.TableRow>
            ))}
          </mui.TableBody>
        </mui.Table>
      </mui.TableContainer>
    */

  return (
    <div className={classes.container}>
      <DeviceView device={main} measures={measures} />
      <DeviceView device={solar} measures={measures} />
      <DeviceView device={total} measures={measures} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {nodes.sortBy(device => findPowerMeasure(device, measures)).reverse().map(device => (
          <SubDeviceView key={device._id} total={total} device={device} measures={measures} />
        ))}
      </div>
    </div>
  );
};

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
  computed: {
    height: 10,
    width: 10,
  },
  good: {
    color: theme.palette.success.main,
  },
  bad: {
    color: theme.palette.error.main,
  },
  tooltipContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  ratioContainer: {
    display: 'flex',
    alignItems: 'center',
    width: 100,
  },
  ratioBar: {
    width: '100%',
    marginRight: theme.spacing(1),
  },
  ratioLabel: {
    minWidth: 35,
  }
}));

const DeviceView: React.FunctionComponent<{ device: LiveDevice, measures: views.View<Measure> }> = ({ device, measures }) => {
  const classes = useDeviceStyles();

  if (!device) {
    return null;
  }

  const Icon = getIcon(device);

  return (
    <div className={classes.container}>
      <Icon className={classes.icon} />
      <mui.Typography>{device.display}</mui.Typography>
      <DeviceMeasure device={device} measures={measures} />
    </div>
  );
};

const SubDeviceView: React.FunctionComponent<{ total: LiveDevice, device: LiveDevice, measures: views.View<Measure> }> = ({ total, device, measures }) => {
  if (!device) {
    return null;
  }

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <SubDeviceRatio total={total} device={device} measures={measures} />
      <mui.Typography>{device.display}</mui.Typography>
      <DeviceMeasure device={device} measures={measures} />
    </div>
  );
};

const SubDeviceRatio: React.FunctionComponent<{ total: LiveDevice, device: LiveDevice, measures: views.View<Measure> }> = ({ total, device, measures }) => {
  const classes = useDeviceStyles();

  const totalPower = findPowerMeasure(total, measures);
  const power = findPowerMeasure(device, measures);
  const ratio = Math.round(power / totalPower * 100);

  return (
    <div className={classes.ratioContainer}>
      <mui.LinearProgress className={classes.ratioBar} variant='determinate' value={ratio} />
      <mui.Typography className={classes.ratioLabel} variant='body2' color='textSecondary'>{`${ratio}%`}</mui.Typography>
    </div>
  );
}

const DeviceMeasure: React.FunctionComponent<{ device: LiveDevice, measures: views.View<Measure> }> = ({ device, measures }) => {
  const classes = useDeviceStyles();
  const { measure, sensor } = findBestSensorMeasure(device, measures);

  if (!measure || !sensor) {
    return (
      <mui.Typography>{`??`}</mui.Typography>
    );
  }

  let flavor: classes.good | classes.bad = null;
  let measureValue = measure.value;

  switch(device.type) {
    case 'main': {
      if (measureValue > 0) {
        flavor = classes.bad;
      } else if (measureValue < 0) {
        flavor = classes.good;
        measureValue = -measureValue;
      }

      break;
    }

    case 'solar': {
      if (measureValue > 0) {
        flavor = classes.good;
      }

      break;
    }
  }

  const value = (
    <mui.Typography className={flavor}>
      {`${measureValue.toFixed(sensor.accuracyDecimals)} ${sensor.unitOfMeasurement}`}
    </mui.Typography>
  );

  const wrapped = device.computed ? (
    <mui.Badge badgeContent={<icons.devices.Computed className={clsx(classes.computed, flavor)} />}>
      {value}
    </mui.Badge>
  ) : (
    value
  );

  return (
    <mui.Tooltip title={<DeviceMeasureTooltip device={device} measures={measures} />}>
      {wrapped}
    </mui.Tooltip>
  );
}

const DeviceMeasureTooltip: React.FunctionComponent<{ device: LiveDevice, measures: views.View<Measure> }> = ({ device, measures }) => {
  const classes = useDeviceStyles();

  return (
    <div class={classes.tooltipContainer}>
      {getSensorData(device, measures).map(({ display, value }, index) => (
        <mui.Typography variant='body2' key={index}>{`${display} : ${value}`}</mui.Typography>
      ))}
      <mui.Typography variant='body2'>{`Mis à jour : ${getLastUpdate(device, measures).toLocaleString()}`}</mui.Typography>
      <mui.Typography variant='body2'>{`(calculé)`}</mui.Typography>
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

function getSensorData(device, measures) {
  const items: { display: string; value: string }[] = [];

  for (const sensor of device.sensors) {
    const measure = measures.get(`${device._id}-${sensor.key}`);
    if (!measure) {
      continue;
    }

    items.push({ display: sensor.display, value: `${measure.value.toFixed(sensor.accuracyDecimals)} ${sensor.unitOfMeasurement}`});
  }

  return items;
}

function getLastUpdate(device, measures) {
  let date = new Date();
  for (const sensor of device.sensors) {
    const measure = measures.get(`${device._id}-${sensor.key}`);
    if (!measure) {
      continue
    }

    if (measure.timestamp < date) {
      date = measure.timestamp
    }
  }

  return date;
}

function findDeviceByType(devices: views.View<LiveDevice>, type: DeviceType) {
  return devices.valueSeq().find(device => device.type === type);
}

function filterDeviceByType(devices: views.View<LiveDevice>, type: DeviceType) {
  return devices.valueSeq().filter(device => device.type === type);
}

function findBestSensorMeasure(device: LiveDevice, measures: views.View<Measure>) {
  const order = ['real-power', 'apparent-power', 'current'];

  for (const target of order) {
    const sensor = device.sensors.find(sensor => sensor.key === target);
    const measure = measures.get(`${device._id}-${target}`);

    if (sensor && measure) {
      return { sensor, measure };
    }
  }

  return { sensor: null, measure: null };
}

function findPowerMeasure(device: LiveDevice, measures: views.View<Measure>) {
  const measure = measures.get(`${device._id}-real-power`);
  return measure ? measure.value : NaN;
}

export default Live;

function useConnect() {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector(state => ({
      devices: getDeviceView(state),
      measures: getMeasureView(state)
    })),
    ...useMemo(() => ({
      enter: () => dispatch(enter()),
      leave: () => dispatch(leave()),
    }), [dispatch])
  };
}
