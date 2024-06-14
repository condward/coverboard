import { FC } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { AddOutlined } from '@mui/icons-material';

import {
  GroupSchema,
  groupSchema,
  SPACING_GAP,
  GroupSchemaOutput,
} from 'types';
import {
  CommonDialog,
  SliderInput,
  DirectionRadio,
  FieldSet,
} from 'components';
import { useMainStore, useToastStore } from 'store';

import { useGetSizesContext } from 'providers';

interface AddGroupPopover {
  onClose: (id?: string) => void;
}
export const AddGroupPopover: FC<AddGroupPopover> = ({ onClose }) => {
  const addGroups = useMainStore((state) => state.addGroups);
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);

  const groupTitleDir = useMainStore((state) => state.configs.groups.title.dir);
  const groupSubTitleDir = useMainStore(
    (state) => state.configs.groups.subtitle.dir,
  );
  const { canvasLimits, coverSizeWidth, coverSizeHeight } =
    useGetSizesContext();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<GroupSchema, unknown, GroupSchemaOutput>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      id: uuidv4(),
      pos: {
        x: 0,
        y: 0,
      },
      title: {
        text: '',
        dir: groupTitleDir,
      },
      subtitle: {
        text: '',
        dir: groupSubTitleDir,
      },
      scale: {
        x: 3,
        y: 3,
      },
    },
  });

  const onSubmit = handleSubmit(
    (values) => {
      addGroups([values]);
      onClose();
    },
    (error) => {
      const errorMessage = Object.values(error).map((err) => err.message)[0];

      if (errorMessage !== undefined) {
        showErrorMessage(errorMessage);
      }
    },
  );

  return (
    <CommonDialog
      onClose={onClose}
      onSubmit={onSubmit}
      opaque
      title="Add group"
      content={
        <Stack direction="column" gap={SPACING_GAP}>
          <FieldSet label="Title" direction="column">
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
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldSet>
          <FieldSet label="Description" direction="column">
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
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldSet>
          <FieldSet
            direction="column"
            label="Position"
            gap={SPACING_GAP / 2}
            flexWrap="nowrap">
            <Controller
              name="pos.x"
              control={control}
              render={({ field }) => (
                <SliderInput
                  label="X"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  max={canvasLimits.width - coverSizeWidth * watch('scale.x')}
                />
              )}
            />
            <Controller
              name="pos.y"
              control={control}
              render={({ field }) => (
                <SliderInput
                  label="Y"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  max={canvasLimits.height - coverSizeHeight * watch('scale.y')}
                />
              )}
            />
          </FieldSet>
          <FieldSet label="Scale" direction="column">
            <Controller
              name="scale.x"
              control={control}
              render={({ field }) => (
                <SliderInput
                  label="Scale X"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  max={8}
                  step={0.5}
                />
              )}
            />
            <Controller
              name="scale.y"
              control={control}
              render={({ field }) => (
                <SliderInput
                  label="Scale Y"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  max={8}
                  step={0.5}
                />
              )}
            />
          </FieldSet>
        </Stack>
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          <Button
            disabled={!isDirty}
            variant="contained"
            color="primary"
            startIcon={<AddOutlined />}
            type="submit">
            Create
          </Button>
        </Stack>
      }
    />
  );
};
