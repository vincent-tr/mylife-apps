import { React, mui, useSelector, views, clsx } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { getMeasureView, getDevice } from '../selectors';
import { Measure, LiveDevice } from '../../../../shared/metadata';

const useMeasureStyles = mui.makeStyles(theme => ({
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
  value: {
    minWidth: 60,
  },
}));

export const DeviceMeasure: React.FunctionComponent<{ deviceId: string }> = ({ deviceId }) => {
  const classes = useMeasureStyles();
  const device = useSelector(state => getDevice(state, deviceId));
  const measures = useSelector(getMeasureView);

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
    <mui.Typography className={clsx(flavor, classes.value)}>
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
    <mui.Tooltip title={<DeviceMeasureTooltip deviceId={deviceId} measures={measures} />}>
      {wrapped}
    </mui.Tooltip>
  );
}

const useMeasuretooltipStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const DeviceMeasureTooltip: React.FunctionComponent<{ deviceId: string }> = ({ deviceId }) => {
  const classes = useMeasuretooltipStyles();
  const device = useSelector(state => getDevice(state, deviceId));
  const measures = useSelector(getMeasureView);

  return (
    <div className={classes.container}>
      {getSensorData(device, measures).map(({ display, value }, index) => (
        <mui.Typography variant='body2' key={index}>{`${display} : ${value}`}</mui.Typography>
      ))}
      <mui.Typography variant='body2'>{`Mis à jour : ${getLastUpdate(device, measures).toLocaleString()}`}</mui.Typography>
      <mui.Typography variant='body2'>{`(calculé)`}</mui.Typography>
    </div>
  );
};

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
