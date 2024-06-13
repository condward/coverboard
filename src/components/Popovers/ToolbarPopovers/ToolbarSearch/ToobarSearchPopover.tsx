import { FC, useState } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Stack,
  Alert,
  Tooltip,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
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
  SearchSchemaOutput,
  ToolConfigIDs,
  searchSchema,
  SPACING_GAP,
} from 'types';
import { useMainStore, useResetApiKey } from 'store';
import { CommonDialog } from 'components';
import FileImporter from 'components/FileImporter';

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

export const ToolbarSearchPopover: FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const initialState = getInitialState();
  const titleLabel = useMainStore((state) => state.getTitleLabel());
  const subTitleLabel = useMainStore((state) => state.getSubTitleLabel());
  const { resetApiKey } = useResetApiKey();
  const media = useMainStore((state) => state.configs.media);
  const [failedCovers, setFailedCovers] = useState<SearchSchema['search']>([]);
  const addEmptyCover = useAddEmptyCover();
  const { mutateAsync: handleSearch, isPending } = useSearchValues();
  const coversLength = useMainStore((state) => state.covers.length);

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
          <Button
            variant="contained"
            color="primary"
            id="searchSubmit"
            disabled={!isDirty || !isValid || isPending}
            startIcon={<SearchOutlined />}
            type="submit">
            {isPending ? (
              <CircularProgress size="1.5rem" aria-labelledby="searchSubmit" />
            ) : (
              'Search'
            )}
          </Button>
        </Stack>
      }
    />
  );
};
