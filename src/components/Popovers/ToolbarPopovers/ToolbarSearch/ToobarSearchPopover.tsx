import { FC, useState } from 'react';
import { Button, Stack, Alert, Tooltip } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from 'react-hook-form';
import Papa, { ParseResult } from 'papaparse';
import {
  AddOutlined,
  DownloadOutlined,
  InfoOutlined,
  KeyOutlined,
  SearchOutlined,
} from '@mui/icons-material';

import {
  CoverLabelValue,
  mediaMap,
  SearchSchema,
  ToolConfigIDs,
  searchSchema,
  SPACING_GAP,
} from 'types';
import { useShallowMainStore, useResetApiKey } from 'store';
import { CommonDialog, SubmitButton, TextInput } from 'components';
import FileImporter from 'components/FileImporter';
import { useForm } from 'utils';

import { useSearchValues } from './useSearchValues';
import { ToolbarSearchMedia } from './ToobarSeachMedia';
import { useAddEmptyCover } from './useAddEmptyCover';

const getInitialState = (): SearchSchema['search'] => [
  { title: '', subtitle: '' },
  { title: '', subtitle: '' },
  { title: '', subtitle: '' },
  { title: '', subtitle: '' },
  { title: '', subtitle: '' },
];

export const ToolbarSearchPopover: FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const initialState = getInitialState();
  const addEmptyCover = useAddEmptyCover();

  const { resetApiKey } = useResetApiKey();
  const { mutateAsync: handleSearch, isPending } = useSearchValues();

  const { media, coversLength, titleLabel, subTitleLabel } =
    useShallowMainStore((state) => ({
      media: state.configs.media,
      coversLength: state.covers.length,
      titleLabel: state.getTitleLabel(),
      subTitleLabel: state.getSubTitleLabel(),
    }));

  const [failedCovers, setFailedCovers] = useState<SearchSchema['search']>([]);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty, isValid },
  } = useForm({
    resolver: zodResolver(searchSchema({ titleLabel, subTitleLabel })),
    defaultValues: { search: initialState },
  });

  const onSubmit = handleSubmit(async (values) => {
    const results = await handleSearch(values.search);

    const failedResults = values.search.filter(
      (_, idx) => !results.some((res) => res.index === idx),
    );
    setFailedCovers(failedResults);

    if (failedResults.length === 0) {
      onClose();
    } else {
      reset({ search: failedResults.slice(0, 5) }, { keepDirty: false });
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
      dynamicTyping: true,
      complete(results: ParseResult<CoverLabelValue>) {
        reset({ search: results.data.slice(0, 5) });
      },
    });
  };

  const handleSubmitWithoutImage = () => {
    addEmptyCover(failedCovers);
    onClose();
  };

  return (
    <CommonDialog
      title="Search and add"
      onClose={onClose}
      onSubmit={onSubmit}
      hash={ToolConfigIDs.SEARCH}
      header={
        coversLength ? (
          <Tooltip
            title={
              <>
                <p>Clear board</p>
                <p>Add new page in Share button</p>
                <p>Change Url after /coverboard</p>
              </>
            }>
            <Button
              variant="outlined"
              color="info"
              startIcon={<InfoOutlined />}
              sx={{ textTransform: 'capitalize' }}>
              CHANGE MEDIA
            </Button>
          </Tooltip>
        ) : undefined
      }
      content={
        <Stack direction="column" gap={SPACING_GAP}>
          {failedCovers.length === 0 ? (
            <ToolbarSearchMedia onReset={reset} />
          ) : (
            <Alert severity="error">
              The following search fields failed to fetch from the server, try
              again, correct the fields or add them without image
            </Alert>
          )}

          {(failedCovers.length === 0 ? initialState : failedCovers).map(
            (_, index) => (
              <Stack
                direction="row"
                gap={SPACING_GAP / 2}
                key={`input-${index}`}
                flexWrap={{ sm: 'wrap', md: 'inherit' }}>
                <Controller
                  name={`search.${index}.title`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextInput
                      formError={error}
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
                  render={({ field, fieldState: { error } }) => (
                    <TextInput
                      fullWidth
                      formError={error}
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
            ),
          )}
        </Stack>
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          {failedCovers.length === 0 ? (
            <>
              {mediaMap[media].apiName !== null ? (
                <Button
                  variant="outlined"
                  color="secondary"
                  id="changeApiKey"
                  startIcon={<KeyOutlined />}
                  onClick={resetApiKey}>
                  Change ApiKey
                </Button>
              ) : undefined}
              {!isDirty ? (
                <FileImporter
                  accept="csv/*"
                  id="importSearch"
                  label="Import"
                  onFileRead={importCSV}
                  disabled={isDirty}
                />
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  id="searchExport"
                  disabled={!isValid || isPending}
                  onClick={exportCSV}
                  startIcon={<DownloadOutlined />}>
                  Export
                </Button>
              )}
            </>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              id="searchWithoutSubmit"
              onClick={handleSubmitWithoutImage}
              startIcon={<AddOutlined />}>
              Add without image
            </Button>
          )}
          <SubmitButton
            control={control}
            id="searchSubmit"
            disabled={!isValid}
            isPending={isPending}
            startIcon={<SearchOutlined />}
          />
        </Stack>
      }
    />
  );
};
