import React, { useCallback, useMemo } from 'react';
import { Select, Input, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import immutable from 'immutable';
import { getDevicesView } from '../store';

type DeviceMap = { [deviceId: string]: string };

export interface DeviceListProps {
  className?: string;
  value: immutable.Set<string>;
  onChange: (newValue: immutable.Set<string>) => void;
}

const DeviceList: React.FunctionComponent<DeviceListProps> = ({ className, value, onChange }) => {
  const devices = useDevices();
  const handleChange = event => onChange(immutable.Set(event.target.value));
  const selectorValue = useMemo(() => value.toArray(), [value]);
  const renderSelectorValue = useCallback(createSelectorValueRenderer(devices), [devices]);

  return (
    <Select
      multiple
      value={selectorValue}
      onChange={handleChange}
      input={<Input fullWidth />}
      renderValue={renderSelectorValue}
      className={className}
    >
      {Object.entries(devices).map(([id, display]) => (
        <MenuItem key={id} value={id}>
          <Checkbox checked={value.has(id)} />
          <ListItemText primary={display} />
        </MenuItem>
      ))}
    </Select>
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

    for (const device of Object.values(view)) {
      devices[device.deviceId] = device.display;
    }
    
    return devices;
  }, [view]);
}