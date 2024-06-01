import { FormGroup, FormLabel, Slider } from '@mui/material';
import { FC } from 'react';

interface SliderFieldProps {
  value: number;
  onChange:
    | ((event: Event, value: number | number[], activeThumb: number) => void)
    | undefined;
  name: string;
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
}

export const SliderField: FC<SliderFieldProps> = ({
  value,
  onChange,
  id,
  label,
  min,
  max,
  step,
}) => {
  return (
    <FormGroup>
      <FormLabel id={id}>{label}</FormLabel>
      <Slider
        aria-labelledby={id}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="on"
        value={value}
        onChange={onChange}
      />
    </FormGroup>
  );
};
