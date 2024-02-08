import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { PosTypes } from 'types';

interface DirectionRadioProps {
  value: PosTypes;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  name: string;
}

export const DirectionRadio: React.FC<DirectionRadioProps> = ({
  value,
  onChange,
  name,
}) => {
  return (
    <RadioGroup
      row
      aria-label="position"
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
  );
};
