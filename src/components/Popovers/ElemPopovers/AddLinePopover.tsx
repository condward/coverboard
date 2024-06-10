import { FC } from 'react';
import { Stack, TextField, Chip, Button, Alert } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { AddOutlined } from '@mui/icons-material';

import {
  LineSchema,
  LineSchemaOutput,
  lineSchema,
  SPACING_GAP,
  PosTypes,
} from 'types';
import { CommonDialog, DirectionRadio, FieldSet } from 'components';
import { useMainStore, useToastStore } from 'store';

import { formatLabel } from 'utils';

interface AddLinePopoverProps {
  onClose: (id?: string) => void;
  originId?: string;
}

export const AddLinePopover: FC<AddLinePopoverProps> = ({
  onClose,
  originId,
}) => {
  const addLine = useMainStore((state) => state.addLine);
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const checkIfLineAlreadyExists = useMainStore(
    (state) => state.checkIfLineAlreadyExists,
  );
  const covers = useMainStore((state) => state.covers);
  const groups = useMainStore((state) => state.groups);

  const originCover = covers.find((cov) => cov.id === originId);
  const originGroup = groups.find((grp) => grp.id === originId);

  const originCoverTitle = originCover
    ? formatLabel(originCover.title.text, originCover.id)
    : undefined;
  const originGroupTitle = originGroup
    ? formatLabel(originGroup.title.text, originGroup.id)
    : undefined;
  const title = originCoverTitle || originGroupTitle || '';

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<LineSchema, unknown, LineSchemaOutput>({
    resolver: zodResolver(lineSchema),
    defaultValues: {
      id: uuidv4(),
      title: {
        text: '',
        dir: PosTypes.BOTTOM,
      },
      origin: {
        id: originId ?? undefined,
        dir: PosTypes.BOTTOM,
      },
      target: {
        dir: PosTypes.BOTTOM,
      },
    },
  });

  const filteredOriginCovers = covers.filter(
    (cov) =>
      cov.id !== watch('target.id') &&
      !checkIfLineAlreadyExists(cov.id, watch('target.id')),
  );
  const filteredOriginGroups = groups.filter(
    (grp) =>
      grp.id !== watch('target.id') &&
      !checkIfLineAlreadyExists(grp.id, watch('target.id')),
  );
  const filteredTargetCovers = covers.filter(
    (cov) =>
      cov.id !== watch('origin.id') &&
      !checkIfLineAlreadyExists(cov.id, watch('origin.id')),
  );
  const filteredTargetGroups = groups.filter(
    (grp) =>
      grp.id !== watch('origin.id') &&
      !checkIfLineAlreadyExists(grp.id, watch('origin.id')),
  );

  const onSubmit = handleSubmit(
    (values) => {
      addLine(values);
      onClose();
    },
    (error) => {
      const errorMessage = Object.values(error).map((err) => err.message)[0];

      if (errorMessage) {
        showErrorMessage(errorMessage);
      }
    },
  );

  const isError =
    (filteredOriginCovers.length === 0 && filteredOriginGroups.length === 0) ||
    (filteredTargetCovers.length === 0 && filteredTargetGroups.length === 0);

  return (
    <CommonDialog
      onClose={onClose}
      title="Add Arrow"
      opaque
      onSubmit={onSubmit}
      content={
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
                <FieldSet direction="column" label="origin">
                  <DirectionRadio
                    label="Position"
                    id="origin-position"
                    name="originLineRadio"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {originId ? (
                    <Chip color={'primary'} label={title} />
                  ) : (
                    <>
                      {filteredOriginCovers.length === 0 &&
                        filteredOriginGroups.length === 0 && (
                          <Alert severity="error">
                            There are no connections available
                          </Alert>
                        )}
                      {filteredOriginCovers.length > 0 && (
                        <FieldSet
                          direction="row"
                          label={`Select one cover of (${filteredOriginCovers.length})`}
                          gap={SPACING_GAP / 2}
                          flexWrap="nowrap">
                          <Stack
                            direction="row"
                            flexWrap="wrap"
                            role="radiogroup"
                            gap={SPACING_GAP / 2}>
                            <Controller
                              name="origin.id"
                              control={control}
                              render={({ field }) => (
                                <>
                                  {filteredOriginCovers.map((cover) => {
                                    const isChecked = field.value === cover.id;
                                    return (
                                      <Chip
                                        role="radio"
                                        aria-checked={isChecked}
                                        color={
                                          isChecked ? 'primary' : 'default'
                                        }
                                        key={cover.id}
                                        label={formatLabel(
                                          cover.title.text,
                                          cover.id,
                                        )}
                                        onClick={() => {
                                          field.onChange(cover.id);
                                        }}
                                      />
                                    );
                                  })}
                                </>
                              )}
                            />
                          </Stack>
                        </FieldSet>
                      )}
                      {filteredOriginCovers.length > 0 &&
                        filteredOriginGroups.length > 0 &&
                        'or'}
                      {filteredOriginGroups.length > 0 && (
                        <FieldSet
                          direction="row"
                          label={`Select one group (${filteredOriginGroups.length})`}
                          gap={SPACING_GAP / 2}
                          flexWrap="nowrap">
                          <Stack
                            direction="row"
                            flexWrap="wrap"
                            role="radiogroup"
                            gap={SPACING_GAP / 2}>
                            <Controller
                              name="origin.id"
                              control={control}
                              render={({ field }) => (
                                <>
                                  {filteredOriginGroups.map((group) => {
                                    const isChecked = field.value === group.id;
                                    return (
                                      <Chip
                                        role="radio"
                                        aria-checked={isChecked}
                                        color={
                                          isChecked ? 'primary' : 'default'
                                        }
                                        key={group.id}
                                        label={formatLabel(
                                          group.title.text,
                                          group.id,
                                        )}
                                        onClick={() => {
                                          field.onChange(group.id);
                                        }}
                                      />
                                    );
                                  })}
                                </>
                              )}
                            />
                          </Stack>
                        </FieldSet>
                      )}
                    </>
                  )}
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
                  {filteredTargetCovers.length === 0 &&
                    filteredTargetGroups.length === 0 && (
                      <Alert severity="error">
                        There are no connections available
                      </Alert>
                    )}
                  {filteredTargetCovers.length > 0 && (
                    <FieldSet
                      direction="row"
                      label={`Select one cover (${filteredTargetCovers.length})`}
                      gap={SPACING_GAP / 2}
                      flexWrap="nowrap">
                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        role="radiogroup"
                        gap={SPACING_GAP / 2}>
                        <Controller
                          name="target.id"
                          control={control}
                          render={({ field }) => (
                            <>
                              {filteredTargetCovers.map((cover) => {
                                const isChecked = field.value === cover.id;
                                return (
                                  <Chip
                                    role="radio"
                                    aria-checked={isChecked}
                                    color={isChecked ? 'primary' : 'default'}
                                    key={cover.id}
                                    label={formatLabel(
                                      cover.title.text,
                                      cover.id,
                                    )}
                                    onClick={() => {
                                      field.onChange(cover.id);
                                    }}
                                  />
                                );
                              })}
                            </>
                          )}
                        />
                      </Stack>
                    </FieldSet>
                  )}
                  {filteredTargetCovers.length > 0 &&
                    filteredTargetGroups.length > 0 &&
                    'or'}
                  {filteredTargetGroups.length > 0 && (
                    <FieldSet
                      direction="row"
                      label={`Select one group (${filteredTargetGroups.length})`}
                      gap={SPACING_GAP / 2}
                      flexWrap="nowrap">
                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        role="radiogroup"
                        gap={SPACING_GAP / 2}>
                        <Controller
                          name="target.id"
                          control={control}
                          render={({ field }) => (
                            <>
                              {filteredTargetGroups.map((group) => {
                                const isChecked = field.value === group.id;
                                return (
                                  <Chip
                                    role="radio"
                                    aria-checked={isChecked}
                                    color={isChecked ? 'primary' : 'default'}
                                    key={group.id}
                                    label={formatLabel(
                                      group.title.text,
                                      group.id,
                                    )}
                                    onClick={() => {
                                      field.onChange(group.id);
                                    }}
                                  />
                                );
                              })}
                            </>
                          )}
                        />
                      </Stack>
                    </FieldSet>
                  )}
                </FieldSet>
              );
            }}
          />
        </Stack>
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          <Button
            disabled={!isDirty || isError}
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
