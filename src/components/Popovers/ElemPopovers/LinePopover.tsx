import { FC } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useSetAtom } from 'jotai';

import { LineSchema, LineSchemaOutput, lineSchema } from 'types';
import { CommonDialog, DirectionRadio, SPACING_GAP } from 'components';
import { selectedAtom, useMainStore } from 'store';

export const LinePopover: FC<{
  line: LineSchema;
}> = ({ line }) => {
  const updateLineDir = useMainStore((state) => state.updateLineDir);
  const updateLineText = useMainStore((state) => state.updateLineText);
  const setSelected = useSetAtom(selectedAtom);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<LineSchema, unknown, LineSchemaOutput>({
    resolver: zodResolver(lineSchema),
    defaultValues: line,
  });

  const onSubmit = handleSubmit((values) => {
    updateLineText(line.id, values.text);
    updateLineDir(line.id, values.dir);
    setSelected(null);
  });

  const removeLine = useMainStore((state) => state.removeLine);
  const handleDelete = () => {
    removeLine(line.id);
    setSelected(null);
  };

  return (
    <CommonDialog
      open
      onClose={() => setSelected({ id: line.id, open: false })}
      title="Edit labels"
      onSubmit={onSubmit}
      content={
        <Stack direction="column" gap={SPACING_GAP}>
          <Controller
            name="text"
            control={control}
            render={({ field }) => (
              <TextField
                autoFocus
                label="line label"
                fullWidth
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="dir"
            control={control}
            render={({ field }) => (
              <DirectionRadio
                label="Position"
                id="line-position"
                name="lineRadio"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Stack>
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          <Button
            variant="outlined"
            color="error"
            type="button"
            onClick={handleDelete}>
            Delete
          </Button>
          <Button
            disabled={!isDirty}
            variant="contained"
            color="primary"
            type="submit">
            Submit
          </Button>
        </Stack>
      }
    />
  );
};
