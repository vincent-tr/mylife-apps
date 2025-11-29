import Badge from '@mui/material/Badge';
import { styled, Theme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import icons from '../../common/icons';
import { getDevice } from '../selectors';
import { getMeasuresView } from '../views';

type Flavor = 'good' | 'bad' | null;

interface ValueProps {
  flavor: Flavor;
}

const flavorColor = (theme: Theme, flavor: Flavor) => {
  const colors = {
    good: theme.palette.success.main,
    bad: theme.palette.error.main,
    null: null,
  };

  return colors[flavor];
};

const Value = styled(Typography)<ValueProps>(({ theme, flavor }) => ({
  minWidth: 60,
  color: flavorColor(theme, flavor),
}));

interface ComputedIconProps {
  flavor: Flavor;
}

const ComputedIcon = styled(icons.devices.Computed)<ComputedIconProps>(({ theme, flavor }) => ({
  height: 10,
  width: 10,
  color: flavorColor(theme, flavor),
}));

export interface DeviceMeasureProps {
  deviceId: string;
  sensorKeys: string[];
}

export function DeviceMeasure({ deviceId, sensorKeys }: DeviceMeasureProps) {
  const device = useSelector((state) => getDevice(state, deviceId));
  const measures = useSelector(getMeasuresView);

  const sensorData = getSensorData(device, measures, sensorKeys);

  if (sensorData.length === 0) {
    return <Typography>{`??`}</Typography>;
  }

  let flavor: Flavor = null;
  let measureValue = sensorData[0].measureValue;

  switch (device.type) {
    case 'main': {
      if (measureValue > 0) {
        flavor = 'bad';
      } else if (measureValue < 0) {
        flavor = 'good';
        measureValue = -measureValue;
      }

      break;
    }

    case 'solar': {
      if (measureValue > 0) {
        flavor = 'good';
      }

      break;
    }
  }

  const value = <Value flavor={flavor}>{sensorData.map(({ value }) => value).join(' / ')}</Value>;

  const wrapped = device.computed ? <Badge badgeContent={<ComputedIcon flavor={flavor} />}>{value}</Badge> : value;

  return <Tooltip title={<DeviceMeasureTooltip deviceId={deviceId} />}>{wrapped}</Tooltip>;
}

const TooltipContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const TooltipComputedLabel = styled(Typography)({
  fontStyle: 'italic',
});

interface DeviceMeasureTooltipProps {
  deviceId: string;
}

function DeviceMeasureTooltip({ deviceId }: DeviceMeasureTooltipProps) {
  const device = useSelector((state) => getDevice(state, deviceId));
  const measures = useSelector(getMeasuresView);

  return (
    <TooltipContainer>
      {getSensorData(device, measures).map(({ display, value }, index) => (
        <Typography variant="body2" key={index}>{`${display} : ${value}`}</Typography>
      ))}
      <Typography variant="body2">{`Mis à jour : ${getLastUpdate(device, measures).toLocaleString()}`}</Typography>
      {device.computed && <TooltipComputedLabel variant="body2">{`(calculé)`}</TooltipComputedLabel>}
    </TooltipContainer>
  );
}

function getSensorData(device, measures, sensorKeys: string[] = null) {
  const items: { display: string; measureValue: number; value: string }[] = [];

  for (const sensor of device.sensors) {
    if (sensorKeys && !sensorKeys.includes(sensor.key)) {
      continue;
    }

    const measure = measures[`${device._id}-${sensor.key}`];
    if (!measure) {
      continue;
    }

    items.push({ display: sensor.display, measureValue: measure.value, value: `${measure.value.toFixed(sensor.accuracyDecimals)} ${sensor.unitOfMeasurement}` });
  }

  return items;
}

function getLastUpdate(device, measures) {
  let date = new Date();
  for (const sensor of device.sensors) {
    const measure = measures[`${device._id}-${sensor.key}`];
    if (!measure) {
      continue;
    }

    if (measure.timestamp < date) {
      date = measure.timestamp;
    }
  }

  return date;
}
/*
function findBestSensorMeasure(device: LiveDevice, measures: views.View<Measure>) {
  const order = ['real-power', 'apparent-power', 'current'];

  for (const target of order) {
    const sensor = device.sensors.find((sensor) => sensor.key === target);
    const measure = measures[`${device._id}-${target}`];

    if (sensor && measure) {
      return { sensor, measure };
    }
  }

  return { sensor: null, measure: null };
}
*/
