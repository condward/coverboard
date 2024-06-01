import { FC } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useSetAtom } from 'jotai';

import {
  GroupSchema,
  GroupSchemaOutput,
  groupSchema,
  SPACING_GAP,
} from 'types';
import {
  CommonDialog,
  DirectionRadio,
  FieldSet,
  SliderField,
} from 'components';
import { selectedAtom, useMainStore, useToastStore } from 'store';

export const GroupPopover: FC<{
  group: GroupSchema;
}> = ({ group }) => {
  const updateGroup = useMainStore((state) => state.updateGroup);
  const setSelected = useSetAtom(selectedAtom);
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);

  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );
  const handleDelete = () => {
    removeCoverAndRelatedLines(group.id);
    setSelected(null);
  };

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<GroupSchema, unknown, GroupSchemaOutput>({
    resolver: zodResolver(groupSchema),
    defaultValues: group,
  });

  const onSubmit = handleSubmit(
    (values) => {
      updateGroup(group.id, {
        title: {
          text: values.title.text,
          dir: values.title.dir,
        },
        subtitle: {
          text: values.subtitle.text,
          dir: values.subtitle.dir,
        },
        scaleX: values.scaleX,
        scaleY: values.scaleY,
        x: values.x,
        y: values.y,
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

  return (
    <CommonDialog
      onClose={() => setSelected({ id: group.id, open: false })}
      onSubmit={onSubmit}
      title="Edit group"
      content={
        <Stack direction="column" gap={SPACING_GAP}>
          <FieldSet label="Title" direction="row">
            <Controller
              name="title.text"
              control={control}
              render={({ field }) => (
                <TextField
                  label="text"
                  autoFocus
                  fullWidth
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="title.dir"
              control={control}
              render={({ field }) => (
                <DirectionRadio
                  label="Position"
                  id="group-title"
                  name="titleRadio"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldSet>
          <FieldSet label="Description" direction="row">
            <Controller
              name="subtitle.text"
              control={control}
              render={({ field }) => (
                <TextField
                  label="text"
                  fullWidth
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="subtitle.dir"
              control={control}
              render={({ field }) => (
                <DirectionRadio
                  label="Position"
                  id="group-subtitle"
                  name="subtitleRadio"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldSet>
          <FieldSet label="Scale" direction="column">
            <Controller
              name="scaleX"
              control={control}
              render={({ field }) => (
                <SliderField
                  id="scale-x"
                  name="scaleX"
                  label="ScaleX"
                  aria-labelledby="scale-x"
                  min={0}
                  max={8}
                  step={0.5}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="scaleY"
              control={control}
              render={({ field }) => (
                <SliderField
                  id="scale-y"
                  name="scaleY"
                  label="ScaleY"
                  aria-labelledby="scale-y"
                  min={0}
                  max={8}
                  step={0.5}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldSet>
          <FieldSet
            direction="row"
            label="Position"
            gap={SPACING_GAP / 2}
            flexWrap="nowrap">
            <Controller
              name="x"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  type="number"
                  label="X"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="y"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  type="number"
                  label="Y"
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
