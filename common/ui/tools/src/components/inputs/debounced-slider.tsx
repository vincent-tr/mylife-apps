import Slider, { SliderProps } from '@mui/material/Slider';
import { useCallback } from 'react';
import { useDebounced } from '../behaviors';

export interface DebouncedSliderProps extends Omit<SliderProps, 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export default function DebouncedSlider({ value, onChange, ...props }: DebouncedSliderProps) {
  const { componentValue, componentChange } = useDebounced(value, onChange);

  const handleChange = useCallback(
    (_e: Event, value: number) => {
      componentChange(value);
    },
    [componentChange]
  );

  return <Slider {...props} value={componentValue} onChange={handleChange} />;
}
