import { Slider } from '@mui/material';
import { FC } from 'react';

interface SliderFieldProps {
  value: number;
  onChange:
    | ((event: Event, value: number | number[], activeThumb: number) => void)
    | undefined;
  name: string;
  id: string;
  min: number;
  max: number;
  step: number;
  hidehandle?: boolean;
  disabled?: boolean;
  labelId: string;
}

export const SliderField: FC<SliderFieldProps> = ({
  value,
  onChange,
  id,
  min,
  max,
  step,
  hidehandle,
  disabled,
  labelId,
}) => {
  return (
    <Slider
      id={id}
      aria-labelledby={labelId}
      min={min}
      disabled={disabled}
      max={max}
      step={step}
      valueLabelDisplay="off"
      value={value}
      onChange={onChange}
      sx={{
        ...(hidehandle
          ? {
              '& .MuiSlider-thumb': {
                opacity: 0, // Hide thumb initially
                transition: 'opacity 0.3s', // Smooth transition for thumb appearance
              },
            }
          : {}),
      }}
    />
  );
};
