import { FC } from 'react';
import { Button, Stack, Chip, Box } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from 'react-hook-form';
import {
  AddOutlined,
  DeleteOutlined,
  HideSourceOutlined,
} from '@mui/icons-material';

import {
  CoversSchema,
  PosTypes,
  SPACING_GAP,
  bulkUpdateCoverSchema,
  mediaMap,
} from 'types';

import {
  CommonDialog,
  SliderInput,
  DirectionRadio,
  FieldSet,
  SubmitButton,
} from 'components';
import { useShallowMainStore, useShowToast } from 'store';

import { formatLabel, useForm } from 'utils';
import { useGetSizesContext } from 'providers';

interface BulkUpdateCoversPopoverProps {
  onClose: () => void;
  covers: CoversSchema;
  maxBounds: { x: number; y: number; width: number; height: number };
}

export const BulkUpdateCoversPopover: FC<BulkUpdateCoversPopoverProps> = ({
  onClose,
  covers,
  maxBounds,
}) => {
  const { canvasLimits, coverSizeWidth, coverSizeHeight } =
    useGetSizesContext();

  const { showErrorMessage } = useShowToast();
  const {
    media,
    removeCoverAndRelatedArrows,
    updateCover,
    scale,
    heightRatio,
  } = useShallowMainStore((state) => ({
    media: state.configs.media,
    removeCoverAndRelatedArrows: state.removeCoverAndRelatedArrows,
    updateCover: state.updateCover,
    scale: state.configs.layout.scale,
    heightRatio: state.getHeightRatio(),
  }));

  const offLimitCovers = covers.flatMap((covers) => {
    if (
      (covers.pos.x > canvasLimits.width && canvasLimits.width > scale) ||
      (covers.pos.y > canvasLimits.height && canvasLimits.height > scale)
    ) {
      return covers;
    }

    return [];
  });

  const { control, getValues, handleSubmit, watch } = useForm({
    resolver: zodResolver(bulkUpdateCoverSchema),
    defaultValues: {
      ids: covers.map((cov) => cov.id),
      title: { dir: PosTypes.BOTTOM },
      subtitle: { dir: PosTypes.BOTTOM },
      star: { count: -1, dir: PosTypes.BOTTOM },
      pos: { x: -1, y: -1 },
      pace: { x: 0, y: 0 },
    },
  });

  const onSubmit = handleSubmit(
    (values) => {
      const minValueX = values.pos.x === 0 ? maxBounds.x + 1 : maxBounds.x;
      const minValueY = values.pos.y === 0 ? maxBounds.y + 1 : maxBounds.y;

      values.ids.forEach((id, index) =>
        updateCover(id, {
          title: { dir: values.title.dir },
          subtitle: { dir: values.subtitle.dir },
          star: {
            count: values.star.count > -1 ? values.star.count : undefined,
            dir: values.star.dir,
          },
          pos: {
            x:
              values.pos.x > -1
                ? minValueX +
                  values.pos.x +
                  (index <= values.pace.x ? index * values.pace.x * scale : 0)
                : undefined,
            y:
              values.pos.y > -1
                ? minValueY +
                  values.pos.y +
                  (index <= values.pace.y
                    ? index * values.pace.y * scale * heightRatio
                    : 0)
                : undefined,
          },
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
    getValues('ids').forEach((id) => removeCoverAndRelatedArrows(id));
    onClose();
  };

  const handleBringToScreen = () => {
    offLimitCovers.forEach((cover) => {
      updateCover(cover.id, {
        pos: {
          x:
            cover.pos.x > canvasLimits.width
              ? canvasLimits.width - coverSizeWidth
              : cover.pos.x,
          y:
            cover.pos.y > canvasLimits.height
              ? canvasLimits.height - coverSizeHeight
              : cover.pos.y,
        },
      });
    });
  };

  return (
    <CommonDialog
      onClose={onClose}
      opaque
      title="Bulk Update Covers"
      content={
        <Stack direction="column" gap={SPACING_GAP}>
          <FieldSet
            direction="row"
            label={`Covers Selection (${watch('ids').length})`}
            gap={SPACING_GAP / 2}
            flexWrap="nowrap">
            <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
              <Controller
                name="ids"
                control={control}
                render={({ field }) => (
                  <>
                    {covers.map((cover) => {
                      const isChecked = field.value.includes(cover.id);
                      // offLimitCovers
                      return (
                        <Chip
                          role="checkbox"
                          icon={
                            offLimitCovers.some(
                              (cov) => cov.id === cover.id,
                            ) ? (
                              <Box title="Hidden">
                                <HideSourceOutlined />
                              </Box>
                            ) : undefined
                          }
                          aria-checked={isChecked}
                          color={isChecked ? 'primary' : 'default'}
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
                  name={field.name}
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
                  name={field.name}
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
              render={({ field, fieldState: { error } }) => (
                <SliderInput
                  formError={error}
                  label="Rating"
                  name={field.name}
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
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldSet>
          <FieldSet
            direction="column"
            label="Coordinate X"
            gap={SPACING_GAP / 2}
            flexWrap="nowrap">
            <Controller
              name="pos.x"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <SliderInput
                  formError={error}
                  label="Start"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  min={-1}
                  max={maxBounds.width - 1}
                />
              )}
            />
            <Controller
              name="pace.x"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <SliderInput
                  formError={error}
                  label="Step"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  max={Math.floor(
                    (maxBounds.width - maxBounds.x - watch('pos.x')) / scale,
                  )}
                />
              )}
            />
          </FieldSet>
          <FieldSet
            direction="column"
            label="Coordinate Y"
            gap={SPACING_GAP / 2}
            flexWrap="nowrap">
            <Controller
              name="pos.y"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <SliderInput
                  formError={error}
                  label="Start"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  min={-1}
                  max={maxBounds.height - 1}
                />
              )}
            />
            <Controller
              name="pace.y"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <SliderInput
                  formError={error}
                  label="Step"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  max={Math.floor(
                    (maxBounds.height - maxBounds.y - watch('pos.y')) /
                      (scale + heightRatio),
                  )}
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
            startIcon={<DeleteOutlined />}
            onClick={handleDelete}>
            Delete
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            type="button"
            startIcon={<AddOutlined />}
            disabled={offLimitCovers.length === 0}
            onClick={handleBringToScreen}>
            Bring to screen
          </Button>
          <SubmitButton
            control={control}
            disabled={watch('ids').length === 0}
          />
        </Stack>
      }
      onSubmit={onSubmit}
    />
  );
};
