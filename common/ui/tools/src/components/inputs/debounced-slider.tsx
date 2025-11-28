import Slider, { SliderProps } from '@mui/material/Slider';
import { useDebounced } from '../behaviors';

export interface DebouncedSliderProps extends Omit<SliderProps, 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export default function DebouncedSlider({ value, onChange, ...props }: DebouncedSliderProps) {
  const { componentValue, componentChange } = useDebounced(value, onChange);

  const handleChange = (e, value) => {
    componentChange(value);
  };

  return <Slider {...props} value={componentValue} onChange={handleChange} />;
}
