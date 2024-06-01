import { FC } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useSetAtom } from 'jotai';

import { LineSchema, LineSchemaOutput, lineSchema, SPACING_GAP } from 'types';
import { CommonDialog, DirectionRadio, FieldSet } from 'components';
import { selectedAtom, useMainStore, useToastStore } from 'store';

export const LinePopover: FC<{
  line: LineSchema;
}> = ({ line }) => {
  const updateLine = useMainStore((state) => state.updateLine);
  const setSelected = useSetAtom(selectedAtom);
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<LineSchema, unknown, LineSchemaOutput>({
    resolver: zodResolver(lineSchema),
    defaultValues: line,
  });

  const onSubmit = handleSubmit(
    (values) => {
      updateLine(line.id, {
        text: values.text,
        dir: values.dir,
        origin: { dir: values.origin.dir },
        target: { dir: values.target.dir },
      });
      setSelected(null);
    },
    (error) => {
      const errorMessage = Object.values(error).map((err) => err.message)[0];

      if (errorMessage) {
        showErrorMessage(errorMessage);
      }
    },
  );

  const removeLine = useMainStore((state) => state.removeLine);
  const handleDelete = () => {
    removeLine(line.id);
    setSelected(null);
  };

  const handleSwapDirection = () => {
    updateLine(line.id, {
      origin: { id: line.target.id, dir: line.target.dir },
      target: { id: line.origin.id, dir: line.origin.dir },
    });
    setSelected(null);
  };

  return (
    <CommonDialog
      onClose={() => setSelected({ id: line.id, open: false })}
      title="Edit labels"
      onSubmit={onSubmit}
      content={
        <Stack direction="column" gap={SPACING_GAP}>
          <FieldSet direction="column" label="Label">
            <Controller
              name="text"
              control={control}
              render={({ field }) => (
                <TextField
                  autoFocus
                  label="text"
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
          </FieldSet>
          <FieldSet direction="column" label="Arrow Position">
            <Controller
              name="origin.dir"
              control={control}
              render={({ field }) => (
                <DirectionRadio
                  label="Start Position"
                  id="start-position"
                  name="startLineRadio"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="target.dir"
              control={control}
              render={({ field }) => (
                <DirectionRadio
                  label="End Position"
                  id="end-position"
                  name="endLineRadio"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldSet>
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
            variant="outlined"
            color="secondary"
            type="button"
            onClick={handleSwapDirection}>
            Swap Direction
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
