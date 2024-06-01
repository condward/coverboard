import { FC, useState } from 'react';
import { Button, CircularProgress, Stack, TextField } from '@mui/material';

import { ApiKeys, ToolConfigIDs, SPACING_GAP } from 'types';
import { CommonDialog } from 'components';
import { useToastStore, useUpdateApiKey } from 'store';

import { ToolbarSearchMedia } from './ToobarSeachMedia';
import { useCheckApiKey } from './useCheckApiKey';

interface ToolbarApiKeyPopoverProps {
  apiName: ApiKeys;
  onClose: () => void;
}

export const ToolbarApiKeyPopover: FC<ToolbarApiKeyPopoverProps> = ({
  apiName,
  onClose,
}) => {
  const [key, setKey] = useState('');
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);

  const { updateApiKey } = useUpdateApiKey(apiName);
  const { mutateAsync: checkApi, isPending } = useCheckApiKey(apiName);

  return (
    <CommonDialog
      title="Search and add"
      onClose={onClose}
      hash={ToolConfigIDs.SEARCH}
      onSubmit={async (evt) => {
        evt.preventDefault();

        try {
          await checkApi(key);
          updateApiKey(key);
        } catch {
          showErrorMessage('API key is invalid');
        }
      }}
      content={
        <Stack direction="column" gap={SPACING_GAP}>
          <ToolbarSearchMedia onReset={() => setKey('')} />
          <TextField
            fullWidth
            autoFocus
            label={`Enter ${apiName} api key`}
            value={key}
            onChange={(event) => setKey(event.target.value)}
          />
        </Stack>
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP}>
          <Button
            variant="contained"
            color="primary"
            id="searchSubmit"
            disabled={!key}
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
