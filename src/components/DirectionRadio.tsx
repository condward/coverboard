import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  Stack,
} from '@mui/material';
import { FC, ChangeEvent } from 'react';

import { PosTypes, SPACING_GAP } from 'types';

interface DirectionRadioProps {
  value: PosTypes | 'none';
  onChange: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
  name: string;
  label?: string;
}

export const DirectionRadio: FC<DirectionRadioProps> = ({
  value,
  onChange,
  name,
  label = 'Position',
}) => {
  return (
    <FormControl component="fieldset">
      <Stack
        direction="row"
        alignItems="center"
        gap={SPACING_GAP}
        justifyContent="space-between"
        flexWrap="wrap">
        <FormLabel
          component="legend"
          id={name}
          sx={{ textTransform: 'capitalize' }}>
          {label}:
        </FormLabel>
        <RadioGroup
          row
          aria-label="position"
          aria-labelledby={name}
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
      </Stack>
    </FormControl>
  );
};
