import Slider, { SliderProps } from '@mui/material/Slider';
import React from 'react';
import { useDebounced } from '../behaviors';

export interface DebouncedSliderProps extends Omit<SliderProps, 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

const DebouncedSlider: React.FC<DebouncedSliderProps> = ({ value, onChange, ...props }) => {
  const { componentValue, componentChange } = useDebounced(value, onChange);

  const handleChange = (e, value) => {
    componentChange(value);
  };

  return <Slider {...props} value={componentValue} onChange={handleChange} />;
};

export default DebouncedSlider;
