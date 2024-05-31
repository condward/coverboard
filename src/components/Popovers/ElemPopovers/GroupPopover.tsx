import { FC } from 'react';
import {
  TextField,
  Button,
  Slider,
  FormGroup,
  FormLabel,
  Stack,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useSetAtom } from 'jotai';

import { GroupSchema, GroupSchemaOutput, groupSchema } from 'types';
import { CommonDialog, DirectionRadio, SPACING_GAP } from 'components';
import { selectedAtom, useMainStore } from 'store';

export const GroupPopover: FC<{
  group: GroupSchema;
}> = ({ group }) => {
  const updateGroup = useMainStore((state) => state.updateGroup);
  const setSelected = useSetAtom(selectedAtom);

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

  const onSubmit = handleSubmit((values) => {
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
    });
    setSelected(null);
  });

  return (
    <CommonDialog
      open
      onClose={() => setSelected({ id: group.id, open: false })}
      onSubmit={onSubmit}
      title="Edit group"
      content={
        <Stack direction="column" gap={SPACING_GAP}>
          <Controller
            name="title.text"
            control={control}
            render={({ field }) => (
              <TextField
                label="Group title"
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
          <Controller
            name="subtitle.text"
            control={control}
            render={({ field }) => (
              <TextField
                label="Group description"
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
          <FormGroup>
            <FormLabel id="scale-x">ScaleX:</FormLabel>
            <Controller
              name="scaleX"
              control={control}
              render={({ field }) => (
                <Slider
                  aria-labelledby="scale-x"
                  min={0}
                  max={10}
                  step={0.5}
                  valueLabelDisplay="on"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel id="scale-y">ScaleY:</FormLabel>
            <Controller
              name="scaleY"
              control={control}
              render={({ field }) => (
                <Slider
                  aria-labelledby="scale-y"
                  min={0}
                  max={10}
                  step={0.5}
                  valueLabelDisplay="on"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormGroup>
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
