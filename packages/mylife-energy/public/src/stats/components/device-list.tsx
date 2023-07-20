import { React, mui, useCallback, useSelector, immutable, useMemo } from 'mylife-tools-ui';
import { getDevicesView } from '../selectors';

type DeviceMap = { [deviceId: string]: string };

export interface DeviceListProps {
  value: immutable.Set<string>;
  onChange: (newValue: immutable.Set<string>) => void;
}

const DeviceList: React.FunctionComponent<DeviceListProps> = ({ value, onChange }) => {
  const devices = useDevices();
  const handleChange = event => onChange(immutable.Set(event.target.value));
  const selectorValue = useMemo(() => value.toArray(), [value]);
  const renderSelectorValue = useCallback(createSelectorValueRenderer(devices), [devices]);

  return (
    <mui.Select
      multiple
      value={selectorValue}
      onChange={handleChange}
      input={<mui.Input fullWidth />}
      renderValue={renderSelectorValue}
    >
      {Object.entries(devices).map(([id, display]) => (
        <mui.MenuItem key={id} value={id}>
          <mui.Checkbox checked={value.has(id)} />
          <mui.ListItemText primary={display} />
        </mui.MenuItem>
      ))}
    </mui.Select>
  );
};

export default DeviceList;

function createSelectorValueRenderer(devices: DeviceMap) {
  return (selection: string[]) => selection.map(id => devices[id]).join(', ');
}

function useDevices() {
  const view = useSelector(getDevicesView);

  return useMemo(() => {
    const devices: DeviceMap = {};

    for (const device of view.valueSeq()) {
      devices[device.deviceId] = device.display;
    }
    
    return devices;
  }, [view]);
}