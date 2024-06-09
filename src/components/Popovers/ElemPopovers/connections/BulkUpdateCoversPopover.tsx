import { FC } from 'react';
import { Button, Stack, Chip, Box } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  AddOutlined,
  DeleteOutline,
  HideSourceOutlined,
  SaveOutlined,
} from '@mui/icons-material';

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
  SliderInput,
  DirectionRadio,
  FieldSet,
} from 'components';
import { useMainStore, useToastStore } from 'store';

import { formatLabel } from 'utils';
import { useGetSizesContext } from 'providers';

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
  const scale = useMainStore((state) => state.configs.layout.scale);
  const heightRatio = useMainStore((state) => state.getHeightRatio());
  const { dragLimits, coverSizeWidth, coverSizeHeight } = useGetSizesContext();
  const offLimitCovers = covers.flatMap((covers) => {
    if (
      (covers.pos.x > dragLimits.width && dragLimits.width > scale) ||
      (covers.pos.y > dragLimits.height && dragLimits.height > scale)
    ) {
      return covers;
    }

    return [];
  });

  const { control, getValues, handleSubmit, watch } = useForm<
    BulkUpdateCoverSchema,
    unknown,
    BulkUpdateCoverSchemaOutput
  >({
    resolver: zodResolver(bulkUpdateCoverSchema),
    defaultValues: {
      ids: covers.map((cov) => cov.id),
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
      pos: {
        x: -1,
        y: -1,
      },
      pace: {
        x: 0,
        y: 0,
      },
    },
  });

  const onSubmit = handleSubmit(
    (values) => {
      const minValueX = values.pos.x === 0 ? maxBounds.x + 1 : maxBounds.x;
      const minValueY = values.pos.y === 0 ? maxBounds.y + 1 : maxBounds.y;

      values.ids.forEach((id, index) =>
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
    getValues('ids').forEach((id) => removeCoverAndRelatedLines(id));
    onClose();
  };

  const handleBringToScreen = () => {
    offLimitCovers.forEach((cover) => {
      updateCover(cover.id, {
        pos: {
          x:
            cover.pos.x > dragLimits.width
              ? dragLimits.width - coverSizeWidth
              : cover.pos.x,
          y:
            cover.pos.y > dragLimits.height
              ? dragLimits.height - coverSizeHeight
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
                <SliderInput
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
            label="Coordinate X"
            gap={SPACING_GAP / 2}
            flexWrap="nowrap">
            <Controller
              name="pos.x"
              control={control}
              render={({ field }) => (
                <SliderInput
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
              render={({ field }) => (
                <SliderInput
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
              render={({ field }) => (
                <SliderInput
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
              render={({ field }) => (
                <SliderInput
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
            startIcon={<DeleteOutline />}
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
          <Button
            disabled={watch('ids').length === 0}
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
