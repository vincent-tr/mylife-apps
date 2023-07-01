import { React, mui, useMemo, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getDeviceView, getMeasureView } from '../selectors';

type FIXME_any = any;

const Live = () => {
  const { enter, leave, devices, measures } = useConnect();
  useLifecycle(enter, leave);

  return (
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
  );
};

function formatSensors(device, measures) {
  const parts: string[] = [];

  for (const sensor of device.sensors) {
    const measure = measures.get(`${device._id}-${sensor.key}`);
    if (!measure) {
      continue
    }

    parts.push(`${sensor.display} = ${measure.value.toFixed(sensor.accuracyDecimals)} ${sensor.unitOfMeasurement}`);
  }

  return parts.join(', ')
}

function formatUpdate(device, measures) {
  let date = new Date()
  for (const sensor of device.sensors) {
    const measure = measures.get(`${device._id}-${sensor.key}`);
    if (!measure) {
      continue
    }

    if (measure.timestamp < date) {
      date = measure.timestamp
    }
  }

  return date.toLocaleString()
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
