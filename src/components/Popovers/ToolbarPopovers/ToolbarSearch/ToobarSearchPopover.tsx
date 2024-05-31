import { FC } from 'react';
import { TextField, Button, CircularProgress, Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Papa, { ParseResult } from 'papaparse';

import {
  CoverLabelValue,
  CoverLabelValues,
  MediaMap,
  SearchSchema,
  SearchSchemaOutput,
  ToolConfigIDs,
  searchSchema,
} from 'types';
import { useMainStore, useResetApiKey } from 'store';
import { CommonDialog, SPACING_GAP } from 'components';
import FileImporter from 'components/FileImporter';

import { useSearchValues } from './useSearchValues';
import { ToolbarSearchMedia } from './ToobarSeachMedia';

const getInitialState = (): CoverLabelValues => [
  { title: '', subtitle: '' },
  { title: '', subtitle: '' },
  { title: '', subtitle: '' },
  { title: '', subtitle: '' },
  { title: '', subtitle: '' },
];

export const ToolbarSearchPopover: FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const initialState = getInitialState();
  const titleLabel = useMainStore((state) => state.getTitleLabel());
  const subTitleLabel = useMainStore((state) => state.getSubTitleLabel());
  const { resetApiKey } = useResetApiKey();
  const media = useMainStore((state) => state.configs.media);

  const { mutateAsync: handleSearch, isPending } = useSearchValues();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty, isValid },
  } = useForm<SearchSchema, unknown, SearchSchemaOutput>({
    resolver: zodResolver(searchSchema({ titleLabel, subTitleLabel })),
    defaultValues: { search: initialState },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await handleSearch(values.search);
      onClose();
    } catch (error) {
      if (error === 'NOT_FOUND') return;
      throw error;
    }
  });

  const exportCSV = () => {
    const exportValues = getValues();

    const csv = Papa.unparse(exportValues.search, { header: true });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `cb_${media}.csv`);
    document.body.append(link);
    link.click();
    link.remove();
  };

  const importCSV = (str: string) => {
    Papa.parse(str, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete(results: ParseResult<CoverLabelValue>) {
        reset({ search: results.data.slice(0, 5) });
      },
    });
  };

  return (
    <CommonDialog
      open
      title="Search and add"
      onClose={onClose}
      onSubmit={onSubmit}
      hash={ToolConfigIDs.SEARCH}
      content={
        <Stack direction="column" gap={SPACING_GAP}>
          <ToolbarSearchMedia />
          {initialState.map((_, index) => (
            <Stack
              direction="row"
              gap={SPACING_GAP / 2}
              key={`input-${index}`}
              flexWrap={{ sm: 'wrap', md: 'inherit' }}>
              <Controller
                name={`search.${index}.title`}
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    autoFocus={index === 0}
                    label={`${titleLabel.label}${titleLabel.required ? '*' : ''}`}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name={`search.${index}.subtitle`}
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    disabled={subTitleLabel.hidden}
                    label={`${subTitleLabel.label}${
                      subTitleLabel.required ? '*' : ''
                    }`}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Stack>
          ))}
        </Stack>
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          {MediaMap[media].apiName !== null && (
            <Button
              variant="outlined"
              color="secondary"
              id="changeApiKey"
              onClick={resetApiKey}>
              Change ApiKey
            </Button>
          )}
          <Button
            variant="outlined"
            color="secondary"
            id="searchExport"
            disabled={!isDirty || !isValid || isPending}
            onClick={exportCSV}>
            Export
          </Button>
          <FileImporter
            accept="csv/*"
            id="importSearch"
            label="Import CSV"
            onFileRead={importCSV}
            disabled={isDirty}
          />
          <Button
            variant="contained"
            color="primary"
            id="searchSubmit"
            disabled={!isDirty || !isValid || isPending}
            type="submit">
            {isPending ? (
              <CircularProgress size="1.5rem" aria-labelledby="searchSubmit" />
            ) : (
              'Submit'
            )}
          </Button>
        </Stack>
      }
    />
  );
};
