import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { FC } from 'react';
import type { FieldError } from 'react-hook-form';

type TextInputProps = TextFieldProps & {
  formError?: FieldError;
};

export const TextInput: FC<TextInputProps> = ({ formError, ...props }) => {
  return (
    <Tooltip
      title={formError?.message ?? ''}
      placement="bottom"
      arrow
      open={!!formError}>
      <TextField {...props} error={!!formError} />
    </Tooltip>
  );
};
