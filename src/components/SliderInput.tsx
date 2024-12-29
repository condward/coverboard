import { FormLabel, FormGroup } from '@mui/material';
import { ChangeEventHandler, FC } from 'react';
import type { FieldError } from 'react-hook-form';

import { SliderField } from './SliderField';
import { InputAction } from './InputAction';
import { TextInput } from './TextInput';

interface SliderInputProp {
  value: number;
  name: string;
  onChange: (
    event: Event,
    value: number | number[],
    activeThumb: number,
  ) => void;
  min?: number;
  step?: number;
  max: number;
  label: string;
  formError?: FieldError;
}

export const SliderInput: FC<SliderInputProp> = ({
  value,
  onChange,
  min = 0,
  max,
  label,
  name,
  step = 1,
  formError,
}) => (
  <FormGroup>
    <InputAction
      input={
        <>
          <FormLabel id={`${name}-slider-label`}>{label}</FormLabel>
          <SliderField
            id={`${name}-slider-id`}
            labelId={`${name}-slider-label`}
            name={name}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            hidehandle={value === -1}
          />
        </>
      }
      action={
        <TextInput
          fullWidth
          id={`${name}-number-id`}
          type="number"
          name={name}
          aria-label={name}
          value={value}
          disabled={value === -1}
          formError={formError}
          onChange={
            onChange as unknown as ChangeEventHandler<
              HTMLTextAreaElement | HTMLInputElement
            >
          }
          slotProps={{
            htmlInput: {
              min,
              max,
              step,
              'aria-label': label,
            },
          }}
        />
      }
    />
  </FormGroup>
);
