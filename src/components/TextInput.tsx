import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { FC, useState } from 'react';
import type { FieldError } from 'react-hook-form';

import { Colors } from 'types';

type TextInputProps = TextFieldProps & {
  formError?: FieldError;
};

export const TextInput: FC<TextInputProps> = ({ formError, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Tooltip
      title={formError?.message ?? ''}
      open={!!formError && isFocused}
      placement="bottom"
      arrow
      slotProps={{
        tooltip: {
          sx: {
            width: '220px',
            backgroundColor: Colors.RED,
            color: 'white',
            fontWeight: 'bold',
            padding: '0.5rem',
          },
        },
        arrow: {
          sx: {
            color: Colors.RED,
          },
        },
      }}>
      <TextField
        {...props}
        error={!!formError}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </Tooltip>
  );
};
