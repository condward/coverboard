import { FC } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useAtomValue } from 'jotai';
import {
  ArrowCircleLeftOutlined,
  ArrowCircleRightOutlined,
  DeleteOutlined,
  SaveOutlined,
  SwapHorizOutlined,
} from '@mui/icons-material';

import { ArrowSchema, ArrowSchemaOutput, SPACING_GAP } from 'types';
import { CommonDialog, DirectionRadio, FieldSet } from 'components';
import { configAtom, useMainStore, useToastStore } from 'store';

import { formatLabel } from 'utils';

interface ArrowPopoverProps {
  onClose: (id?: string) => void;
  onChange: (from: string, to: string) => void;
  onReturn?: () => void;
  arrow: ArrowSchema;
}

export const ArrowPopover: FC<ArrowPopoverProps> = ({
  arrow,
  onClose,
  onChange,
  onReturn,
}) => {
  const updateArrow = useMainStore((state) => state.updateArrow);
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const covers = useMainStore((state) => state.covers);
  const groups = useMainStore((state) => state.groups);
  const configToolbarOpen = useAtomValue(configAtom);

  const originCoverTitle = covers.find((cov) => cov.id === arrow.origin.id)
    ?.title.text;
  const targetCoverTitle = covers.find((cov) => cov.id === arrow.target.id)
    ?.title.text;
  const originGroupTitle = groups.find((grp) => grp.id === arrow.origin.id)
    ?.title.text;
  const targetGroupTitle = groups.find((grp) => grp.id === arrow.target.id)
    ?.title.text;

  const originTitle = originCoverTitle || originGroupTitle || '';
  const targetTitle = targetCoverTitle || targetGroupTitle || '';

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ArrowSchema, unknown, ArrowSchemaOutput>({
    resolver: zodResolver(ArrowSchema),
    defaultValues: arrow,
  });

  const onSubmit = handleSubmit(
    (values) => {
      updateArrow(arrow.id, {
        title: {
          text: values.title.text,
          dir: values.title.dir,
        },
        origin: { dir: values.origin.dir },
        target: { dir: values.target.dir },
      });
      onClose();
    },
    (error) => {
      const errorMessage = Object.values(error).map((err) => err.message)[0];

      if (errorMessage) {
        showErrorMessage(errorMessage);
      }
    },
  );

  const removeArrow = useMainStore((state) => state.removeArrow);
  const handleDelete = () => {
    removeArrow(arrow.id);
    onClose();
  };

  const handleSwapDirection = () => {
    updateArrow(arrow.id, {
      origin: { id: arrow.target.id, dir: arrow.target.dir },
      target: { id: arrow.origin.id, dir: arrow.origin.dir },
    });
    onClose();
  };

  return (
    <CommonDialog
      onClose={() => onClose(arrow.id)}
      onReturn={onReturn}
      title="Edit Arrow"
      opaque={configToolbarOpen}
      onSubmit={onSubmit}
      content={
        <>
          <Stack direction="row" justifyContent="end">
            <small>ID: {arrow.id.slice(0, 8).toUpperCase()}</small>
          </Stack>
          <Stack direction="column" gap={SPACING_GAP}>
            <FieldSet direction="column" label="Label">
              <Controller
                name="title.text"
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
            <Controller
              name="origin.dir"
              control={control}
              render={({ field }) => {
                return (
                  <FieldSet direction="column" label="Origin">
                    <DirectionRadio
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <Button
                      variant="outlined"
                      type="button"
                      component="a"
                      color="primary"
                      startIcon={<ArrowCircleLeftOutlined />}
                      onClick={() => onChange(arrow.id, arrow.origin.id)}>
                      {formatLabel(originTitle, arrow.origin.id).slice(0, 50)}
                    </Button>
                  </FieldSet>
                );
              }}
            />
            <Controller
              name="target.dir"
              control={control}
              render={({ field }) => {
                return (
                  <FieldSet direction="column" label="Target">
                    <DirectionRadio
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <Button
                      variant="outlined"
                      type="button"
                      color="primary"
                      component="a"
                      startIcon={<ArrowCircleRightOutlined />}
                      onClick={() => onChange(arrow.id, arrow.target.id)}>
                      {formatLabel(targetTitle, arrow.target.id).slice(0, 50)}
                    </Button>
                  </FieldSet>
                );
              }}
            />
          </Stack>
        </>
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          <Button
            variant="contained"
            color="error"
            type="button"
            startIcon={<DeleteOutlined />}
            onClick={handleDelete}>
            Delete
          </Button>
          <Button
            variant="contained"
            color="secondary"
            type="button"
            startIcon={<SwapHorizOutlined />}
            onClick={handleSwapDirection}>
            Swap Direction
          </Button>
          <Button
            disabled={!isDirty}
            variant="contained"
            color="primary"
            startIcon={<SaveOutlined />}
            type="submit">
            Save
          </Button>
        </Stack>
      }
    />
  );
};
