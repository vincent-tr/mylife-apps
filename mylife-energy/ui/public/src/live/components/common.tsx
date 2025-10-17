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

export const DeviceMeasure: React.FunctionComponent<{ deviceId: string; sensorKeys: string[] }> = ({ deviceId, sensorKeys }) => {
  const classes = useMeasureStyles();
  const device = useSelector(state => getDevice(state, deviceId));
  const measures = useSelector(getMeasureView);

  const sensorData = getSensorData(device, measures, sensorKeys);

  if (sensorData.length === 0) {
    return (
      <mui.Typography>{`??`}</mui.Typography>
    );

  }

  let flavor: string = null;
  let measureValue = sensorData[0].measureValue;

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
      {sensorData.map(({ value }) => value).join(' / ')}
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
    <mui.Tooltip title={<DeviceMeasureTooltip deviceId={deviceId} />}>
      {wrapped}
    </mui.Tooltip>
  );
}

const useMeasuretooltipStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  computed: {
    fontStyle: 'italic',
  }
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
      {device.computed && (
        <mui.Typography variant='body2' className={classes.computed}>{`(calculé)`}</mui.Typography>
      )}
    </div>
  );
};

function getSensorData(device, measures, sensorKeys: string[] = null) {
  const items: { display: string; measureValue: number; value: string }[] = [];

  for (const sensor of device.sensors) {
    if (sensorKeys && !sensorKeys.includes(sensor.key)) {
      continue;
    }

    const measure = measures.get(`${device._id}-${sensor.key}`);
    if (!measure) {
      continue;
    }

    items.push({ display: sensor.display, measureValue: measure.value, value: `${measure.value.toFixed(sensor.accuracyDecimals)} ${sensor.unitOfMeasurement}`});
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
