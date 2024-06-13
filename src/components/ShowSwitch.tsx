import { FormControlLabel, Switch } from '@mui/material';
import { FC, ChangeEvent } from 'react';

interface ShowSwitchProps {
  value: boolean;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  label?: string;
}

export const ShowSwitch: FC<ShowSwitchProps> = ({
  value,
  onChange,
  name,
  label = 'Show',
}) => {
  return (
    <FormControlLabel
      name={name}
      control={<Switch checked={value} onChange={onChange} />}
      label={label}
    />
  );
};
