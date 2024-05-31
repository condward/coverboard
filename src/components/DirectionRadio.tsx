import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
} from '@mui/material';
import { FC, ChangeEvent } from 'react';

import { PosTypes } from 'types';

interface DirectionRadioProps {
  value: PosTypes;
  onChange: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
  name: string;
  id: string;
  label: string;
}

export const DirectionRadio: FC<DirectionRadioProps> = ({
  value,
  onChange,
  name,
  id,
  label,
}) => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" id={id}>
        {label}
      </FormLabel>
      <RadioGroup
        row
        aria-label="position"
        aria-labelledby={id}
        name={name}
        value={value}
        onChange={onChange}>
        <FormControlLabel
          value={PosTypes.LEFT}
          control={<Radio />}
          label={PosTypes.LEFT}
        />
        <FormControlLabel
          value={PosTypes.TOP}
          control={<Radio />}
          label={PosTypes.TOP}
        />
        <FormControlLabel
          value={PosTypes.BOTTOM}
          control={<Radio />}
          label={PosTypes.BOTTOM}
        />
        <FormControlLabel
          value={PosTypes.RIGHT}
          control={<Radio />}
          label={PosTypes.RIGHT}
        />
      </RadioGroup>
    </FormControl>
  );
};
