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

import {
  Colors,
  colorMap,
  backColorMap,
  BackColors,
  POPOVER_BACK_COLOR,
} from 'types';

const commonSelectSx = {
  fontSize: '0.8rem',
  fontWeight: 'bold',
  width: '100%',
};

interface ColorPickerProps {
  value: Colors;
  name: string;
  onChange: (colors: SelectChangeEvent<Colors>, child: ReactNode) => void;
}

export const ColorPicker: FC<ColorPickerProps> = ({
  value,
  name,
  onChange,
}) => {
  return (
    <FormControl>
      <InputLabel id={name}>Color</InputLabel>
      <Select
        labelId={name}
        aria-labelledby={name}
        label="Color"
        value={value}
        onChange={onChange}>
        {Object.values(Colors).map((clr) => (
          <MenuItem value={clr} key={clr}>
            <Button
              sx={{
                ...commonSelectSx,
                backgroundColor: colorMap[clr],
                color:
                  clr === Colors.YELLOW
                    ? backColorMap[BackColors.DARK]
                    : POPOVER_BACK_COLOR,
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
