import { FC } from 'react';
import { Button, Stack, Chip } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { DeleteOutline, SaveOutlined } from '@mui/icons-material';

import {
  BulkUpdateCoverSchema,
  BulkUpdateCoverSchemaOutput,
  CoversSchema,
  DragLimits,
  SPACING_GAP,
  bulkUpdateCoverSchema,
  mediaMap,
} from 'types';

import {
  CommonDialog,
  DirectionRadio,
  FieldSet,
  SliderField,
} from 'components';
import { useMainStore, useToastStore } from 'store';

import { formatLabel } from 'utils';

interface BulkUpdateCoversPopoverProps {
  onClose: () => void;
  covers: CoversSchema;
  maxBounds: DragLimits;
}

export const BulkUpdateCoversPopover: FC<BulkUpdateCoversPopoverProps> = ({
  onClose,
  covers,
  maxBounds,
}) => {
  const media = useMainStore((state) => state.configs.media);
  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const updateCover = useMainStore((state) => state.updateCover);

  const {
    control,
    getValues,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<BulkUpdateCoverSchema, unknown, BulkUpdateCoverSchemaOutput>({
    resolver: zodResolver(bulkUpdateCoverSchema),
    defaultValues: {
      ids: [],
      title: {
        dir: 'none',
      },
      subtitle: {
        dir: 'none',
      },
      star: {
        count: -1,
        dir: 'none',
      },
      x: -1,
      y: -1,
    },
  });

  const onSubmit = handleSubmit(
    (values) => {
      const minValueX = values.x === 0 ? maxBounds.x + 1 : maxBounds.x;
      const minValueY = values.y === 0 ? maxBounds.y + 1 : maxBounds.y;

      values.ids.forEach((id) =>
        updateCover(id, {
          title: {
            dir: values.title.dir !== 'none' ? values.title.dir : undefined,
          },
          subtitle: {
            dir:
              values.subtitle.dir !== 'none' ? values.subtitle.dir : undefined,
          },
          star: {
            count: values.star.count > -1 ? values.star.count : undefined,
            dir: values.star.dir !== 'none' ? values.star.dir : undefined,
          },
          x: values.x > -1 ? minValueX + values.x : undefined,
          y: values.y > -1 ? minValueY + values.y : undefined,
        }),
      );

      onClose();
    },
    (error) => {
      const errorMessage = Object.values(error).map((err) => err.message)[0];

      if (errorMessage !== undefined) {
        showErrorMessage(errorMessage);
      }
    },
  );

  const handleDelete = () => {
    getValues('ids').forEach((id) => removeCoverAndRelatedLines(id));
    onClose();
  };

  return (
    <CommonDialog
      onClose={onClose}
      title="Bulk Update Covers"
      content={
        <Stack direction="column" gap={SPACING_GAP}>
          <FieldSet
            direction="row"
            label="Child Covers"
            gap={SPACING_GAP / 2}
            flexWrap="nowrap">
            <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
              <Controller
                name="ids"
                control={control}
                render={({ field }) => (
                  <>
                    {covers.map((cover) => {
                      return (
                        <Chip
                          aria-checked={field.value.includes(cover.id)}
                          color={
                            field.value.includes(cover.id)
                              ? 'primary'
                              : 'default'
                          }
                          key={cover.id}
                          label={formatLabel(cover.title.text, cover.id)}
                          onClick={() => {
                            field.onChange(
                              field.value.includes(cover.id)
                                ? field.value.filter((val) => val !== cover.id)
                                : [...field.value, cover.id],
                            );
                          }}
                        />
                      );
                    })}
                  </>
                )}
              />
            </Stack>
          </FieldSet>

          <FieldSet label={mediaMap[media].title.label} direction="column">
            <Controller
              name="title.dir"
              control={control}
              render={({ field }) => (
                <DirectionRadio
                  label="Position"
                  id="cover-title"
                  name="titleRadio"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldSet>
          <FieldSet label={mediaMap[media].subtitle.label} direction="column">
            <Controller
              name="subtitle.dir"
              control={control}
              render={({ field }) => (
                <DirectionRadio
                  label="Position"
                  id="cover-subtitle"
                  name="subtitleRadio"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldSet>
          <FieldSet label="Rating" direction="column">
            <Controller
              name="star.count"
              control={control}
              render={({ field }) => (
                <SliderField
                  label="Rating"
                  id="star-rating"
                  name="starSlider"
                  value={field.value}
                  onChange={field.onChange}
                  min={0}
                  max={5}
                  step={0.5}
                />
              )}
            />
            <Controller
              name="star.dir"
              control={control}
              render={({ field }) => (
                <DirectionRadio
                  label="Position"
                  id="star-rating"
                  name="starRadio"
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
              name="x"
              control={control}
              render={({ field }) => (
                <SliderField
                  label="X"
                  id="x-value"
                  name="xSlider"
                  value={field.value}
                  onChange={field.onChange}
                  min={0}
                  max={maxBounds.width - 1}
                  step={1}
                />
              )}
            />
            <Controller
              name="y"
              control={control}
              render={({ field }) => (
                <SliderField
                  label="Y"
                  id="y-value"
                  name="ySlider"
                  value={field.value}
                  onChange={field.onChange}
                  min={0}
                  max={maxBounds.height - 1}
                  step={1}
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
            startIcon={<DeleteOutline />}
            onClick={handleDelete}>
            Delete
          </Button>
          <Button
            disabled={!isDirty || watch('ids').length === 0}
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<SaveOutlined />}>
            Save
          </Button>
        </Stack>
      }
      onSubmit={onSubmit}
    />
  );
};
