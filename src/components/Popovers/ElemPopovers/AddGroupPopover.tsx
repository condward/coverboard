import { FC } from 'react';
import { Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from 'react-hook-form';
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
  SubmitButton,
  TextInput,
} from 'components';
import { useShallowMainStore, useShowToast } from 'store';

import { useGetSizesContext } from 'providers';
import { useForm } from 'utils';

interface AddGroupPopover {
  onClose: (id?: string) => void;
}
export const AddGroupPopover: FC<AddGroupPopover> = ({ onClose }) => {
  const { canvasLimits, coverSizeWidth, coverSizeHeight } =
    useGetSizesContext();

  const { showErrorMessage } = useShowToast();
  const { addGroups, groupTitleDir, groupSubTitleDir } = useShallowMainStore(
    (state) => ({
      addGroups: state.addGroups,
      groupTitleDir: state.configs.groups.title.dir,
      groupSubTitleDir: state.configs.groups.subtitle.dir,
    }),
  );

  const { control, handleSubmit, watch } = useForm<
    GroupSchema,
    unknown,
    GroupSchemaOutput
  >({
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
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  formError={error}
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
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  label="text"
                  fullWidth
                  value={field.value}
                  onChange={field.onChange}
                  formError={error}
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
              render={({ field, fieldState: { error } }) => (
                <SliderInput
                  formError={error}
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
              render={({ field, fieldState: { error } }) => (
                <SliderInput
                  label="Y"
                  formError={error}
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
              render={({ field, fieldState: { error } }) => (
                <SliderInput
                  label="Scale X"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  max={8}
                  step={0.5}
                  formError={error}
                />
              )}
            />
            <Controller
              name="scale.y"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <SliderInput
                  label="Scale Y"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  max={8}
                  step={0.5}
                  formError={error}
                />
              )}
            />
          </FieldSet>
        </Stack>
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          <SubmitButton
            control={control}
            text="Create"
            startIcon={<AddOutlined />}
          />
        </Stack>
      }
    />
  );
};
