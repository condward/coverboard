import { FC, useState } from 'react';
import { Button, Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from 'react-hook-form';

import {
  DeleteOutlined,
  LinkOutlined,
  UpdateOutlined,
} from '@mui/icons-material';
import { useAtomValue } from 'jotai';

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
import { configAtom, useShallowMainStore, useShowToast } from 'store';
import { useForm } from 'utils';
import { useGetSizesContext } from 'providers';

import { BulkUpdateCoversPopover } from './connections';
import { GroupConnectionPopover } from './connections/GroupConnectionPopover';

interface GroupPopoverProps {
  onClose: (id?: string) => void;
  onChange: (from: string, to: string) => void;
  onReturn?: () => void;
  group: GroupSchema;
}
export const GroupPopover: FC<GroupPopoverProps> = ({
  group,
  onClose,
  onChange,
  onReturn,
}) => {
  const { canvasLimits, coverSizeWidth, coverSizeHeight } =
    useGetSizesContext();

  const { showErrorMessage } = useShowToast();
  const {
    updateGroup,
    totalElements,
    getCoversInsideGroup,
    getGroupBounds,
    removeGroupAndRelatedArrows,
  } = useShallowMainStore((state) => ({
    updateGroup: state.updateGroup,
    totalElements: state.covers.length + state.groups.length,
    getCoversInsideGroup: state.getCoversInsideGroup,
    getGroupBounds: state.getGroupBounds,
    removeGroupAndRelatedArrows: state.removeGroupAndRelatedArrows,
  }));

  const configToolbarOpen = useAtomValue(configAtom);

  const [open, setOpen] = useState(false);
  const [conn, setOpenConn] = useState(false);

  const groupBound = getGroupBounds(group.id);
  const coversInsideGroup = getCoversInsideGroup(group.id);

  const handleDelete = () => {
    removeGroupAndRelatedArrows(group.id);
    onClose();
  };

  const { control, handleSubmit, watch } = useForm<
    GroupSchema,
    unknown,
    GroupSchemaOutput
  >({
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
        scale: {
          x: values.scale.x,
          y: values.scale.y,
        },
        pos: {
          x: values.pos.x,
          y: values.pos.y,
        },
      });
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
      onClose={() => onClose(group.id)}
      opaque={configToolbarOpen}
      onReturn={onReturn}
      onSubmit={onSubmit}
      title="Edit group"
      content={
        <>
          <Stack direction="row" justifyContent="end">
            <small>ID: {group.id.slice(0, 8).toUpperCase()}</small>
          </Stack>
          <Stack direction="column" gap={SPACING_GAP}>
            <FieldSet label="Title" direction="column">
              <Controller
                name="title.text"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    label="text"
                    autoFocus
                    fullWidth
                    value={field.value}
                    onChange={field.onChange}
                    formError={error}
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
                    max={
                      canvasLimits.height - coverSizeHeight * watch('scale.y')
                    }
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
                    formError={error}
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
                render={({ field, fieldState: { error } }) => (
                  <SliderInput
                    label="Scale Y"
                    formError={error}
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
        </>
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          <Button
            variant="outlined"
            color="secondary"
            type="button"
            startIcon={<LinkOutlined />}
            disabled={totalElements < 2}
            onClick={() => setOpenConn(true)}>
            Links
          </Button>
          {conn && (
            <GroupConnectionPopover
              onClose={() => setOpenConn(false)}
              onChange={onChange}
              group={group}
            />
          )}
          <Button
            variant="outlined"
            color="secondary"
            type="button"
            disabled={coversInsideGroup.length === 0}
            onClick={() => setOpen(true)}
            startIcon={<UpdateOutlined />}>
            Bulk update
          </Button>
          <Button
            variant="contained"
            color="error"
            type="button"
            startIcon={<DeleteOutlined />}
            onClick={handleDelete}>
            Delete
          </Button>
          {open && groupBound && (
            <BulkUpdateCoversPopover
              covers={coversInsideGroup}
              onClose={() => setOpen(false)}
              maxBounds={{
                x: group.pos.x,
                y: group.pos.y,
                width: groupBound.x,
                height: groupBound.y,
              }}
            />
          )}
          <SubmitButton control={control} />
        </Stack>
      }
    />
  );
};
