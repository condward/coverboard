import { SaveOutlined } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { useFormState } from 'react-hook-form';
import type { Control, FieldValues } from 'react-hook-form';

interface FormButtonProps<TFieldValues extends FieldValues = FieldValues> {
  text?: string;
  control: Control<TFieldValues>;
  startIcon?: React.ReactNode;
  disabled?: boolean;
  isPending?: boolean;
  id?: string;
}

export const SubmitButton = <TFieldValues extends FieldValues = FieldValues>({
  text = 'Save',
  control,
  startIcon,
  disabled,
  isPending,
  id,
}: FormButtonProps<TFieldValues>) => {
  const { isDirty } = useFormState({ control });

  return (
    <Button
      id={id}
      disabled={!isDirty || !!isPending || !!disabled}
      variant="contained"
      color="primary"
      startIcon={startIcon ?? <SaveOutlined />}
      type="submit">
      {isPending ? (
        <CircularProgress size="1.5rem" aria-labelledby={id} />
      ) : (
        text
      )}
    </Button>
  );
};
