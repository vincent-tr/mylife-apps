import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getDevicesView } from '../views';

type DeviceMap = { [deviceId: string]: string };

export interface DeviceListProps {
  className?: string;
  value: string[];
  onChange: (newValue: string[]) => void;
}

export default function DeviceList({ className, value, onChange }: DeviceListProps) {
  const devices = useDevices();
  const handleChange = (event) => onChange(event.target.value);
  const renderSelectorValue = useCallback((selection: string[]) => selection.map((id) => devices[id]).join(', '), [devices]);

  return (
    <Select multiple value={value} onChange={handleChange} input={<Input fullWidth />} renderValue={renderSelectorValue} className={className}>
      {Object.entries(devices).map(([id, display]) => (
        <MenuItem key={id} value={id}>
          <Checkbox checked={value.includes(id)} />
          <ListItemText primary={display} />
        </MenuItem>
      ))}
    </Select>
  );
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
