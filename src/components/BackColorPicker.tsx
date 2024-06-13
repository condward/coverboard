import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  // eslint-disable-next-line import/named
  SelectChangeEvent,
} from '@mui/material';
import { FC, ReactNode } from 'react';

import { BackColors, POPOVER_BACK_COLOR, backColorMap } from 'types';

const commonSelectSx = {
  fontSize: '0.8rem',
  fontWeight: 'bold',
  width: '100%',
};

interface ColorPickerProps {
  value: BackColors;
  name: string;
  onChange: (colors: SelectChangeEvent<BackColors>, child: ReactNode) => void;
}

export const BackColorPicker: FC<ColorPickerProps> = ({
  value,
  name,
  onChange,
}) => {
  return (
    <FormControl>
      <InputLabel id={name}>Background Color</InputLabel>
      <Select
        labelId={name}
        aria-labelledby={name}
        label="Background Color"
        value={value}
        onChange={onChange}>
        {Object.values(BackColors).map((clr) => (
          <MenuItem value={clr} key={clr}>
            <Button
              sx={{
                ...commonSelectSx,
                backgroundColor: backColorMap[clr],
                color: POPOVER_BACK_COLOR,
                border:
                  clr === value
                    ? `1px solid ${backColorMap[BackColors.DARK]}`
                    : undefined,
              }}>
              {clr}
            </Button>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
