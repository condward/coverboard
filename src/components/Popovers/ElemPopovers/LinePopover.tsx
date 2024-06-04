import { FC } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  ArrowCircleLeftOutlined,
  ArrowCircleRightOutlined,
  DeleteOutline,
  SaveOutlined,
  SwapHorizOutlined,
} from '@mui/icons-material';

import { LineSchema, LineSchemaOutput, lineSchema, SPACING_GAP } from 'types';
import { CommonDialog, DirectionRadio, FieldSet } from 'components';
import { useMainStore, useToastStore } from 'store';

import { formatLabel } from 'utils';

interface LinePopoverProps {
  onClose: (id?: string) => void;
  onChange: (from: string, to: string) => void;
  onReturn?: () => void;
  line: LineSchema;
}

export const LinePopover: FC<LinePopoverProps> = ({
  line,
  onClose,
  onChange,
  onReturn,
}) => {
  const updateLine = useMainStore((state) => state.updateLine);
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const covers = useMainStore((state) => state.covers);
  const groups = useMainStore((state) => state.groups);

  const originCoverTitle = covers.find((cov) => cov.id === line.origin.id)
    ?.title.text;
  const targetCoverTitle = covers.find((cov) => cov.id === line.target.id)
    ?.title.text;
  const originGroupTitle = groups.find((grp) => grp.id === line.origin.id)
    ?.title.text;
  const targetGroupTitle = groups.find((grp) => grp.id === line.target.id)
    ?.title.text;

  const originTitle = originCoverTitle || originGroupTitle || '';
  const targetTitle = targetCoverTitle || targetGroupTitle || '';

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
      onClose();
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
    onClose();
  };

  const handleSwapDirection = () => {
    updateLine(line.id, {
      origin: { id: line.target.id, dir: line.target.dir },
      target: { id: line.origin.id, dir: line.origin.dir },
    });
    onClose();
  };

  return (
    <CommonDialog
      onClose={() => onClose(line.id)}
      onReturn={onReturn}
      title="Edit Line"
      onSubmit={onSubmit}
      content={
        <Stack direction="column" gap={SPACING_GAP}>
          <Stack direction="row" justifyContent="end">
            <legend>ID: {line.id.slice(0, 8).toUpperCase()}</legend>
          </Stack>
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
          <Controller
            name="origin.dir"
            control={control}
            render={({ field }) => {
              return (
                <FieldSet direction="column" label="Origin">
                  <DirectionRadio
                    label="Position"
                    id="origin-position"
                    name="originLineRadio"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <Button
                    variant="outlined"
                    type="button"
                    color="primary"
                    startIcon={<ArrowCircleLeftOutlined />}
                    onClick={() => onChange(line.id, line.origin.id)}>
                    {formatLabel(originTitle, line.origin.id).slice(0, 50)}
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
                    label="Position"
                    id="target-position"
                    name="targetLineRadio"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <Button
                    variant="outlined"
                    type="button"
                    color="primary"
                    startIcon={<ArrowCircleRightOutlined />}
                    onClick={() => onChange(line.id, line.target.id)}>
                    {formatLabel(targetTitle, line.target.id).slice(0, 50)}
                  </Button>
                </FieldSet>
              );
            }}
          />
        </Stack>
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          <Button
            variant="outlined"
            color="error"
            type="button"
            startIcon={<DeleteOutline />}
            onClick={handleDelete}>
            Delete
          </Button>
          <Button
            variant="outlined"
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
