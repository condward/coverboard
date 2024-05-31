import { FC, FormEvent, useState } from 'react';
import {
  FormControl,
  FormLabel,
  Stack,
  TextField,
  TextareaAutosize,
} from '@mui/material';
import { ZodError } from 'zod';
import { useNavigate } from 'react-router-dom';

import { AppSchema, ToolConfigIDs, appSchema } from 'types';
import { CommonDialog, POPOVER_BACK_COLOR, SPACING_GAP } from 'components';

import { useMainStore, useToastStore } from 'store';

import { ToolbarSharePages } from './ToobarSharePages';
import { ToolbarShareActions } from './ToolbarShareActions';

export const ToolbarSharePopover: FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const navigate = useNavigate();
  const updateStoreValues = useMainStore((state) => state.updateStoreValues);
  const showSuccessMessage = useToastStore((state) => state.showSuccessMessage);
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const defaultJsonData = useMainStore((state) =>
    JSON.stringify(state.getStoreValues(), null, 4),
  );
  const [jsonData, setJsonData] = useState(defaultJsonData);
  const [newSave, setNewSave] = useState('');

  const handleImport = (evt: FormEvent) => {
    evt.preventDefault();
    const value = newSave.trim();

    if (value) {
      navigate(`/${value}`);
      onClose();
      return;
    }

    try {
      const parsedData: AppSchema = JSON.parse(jsonData);
      const parsedSchema = appSchema.parse(parsedData);

      updateStoreValues(parsedSchema);

      onClose();
      showSuccessMessage('JSON was applied with success');
    } catch (error) {
      if (error instanceof ZodError) {
        showErrorMessage(JSON.parse(error.message)[0].message);
        return;
      }
      showErrorMessage('JSON data is not valid');
    }
  };

  return (
    <CommonDialog
      onClose={onClose}
      onSubmit={(evt) => handleImport(evt)}
      open
      title="Share and save"
      hash={ToolConfigIDs.SHARE}
      content={
        <Stack direction="column" gap={SPACING_GAP}>
          <ToolbarSharePages onClose={onClose} setJsonData={setJsonData} />
          <TextField
            fullWidth
            label="Add new page"
            onChange={(evt) => setNewSave(evt.target.value.trim())}
            value={newSave}
            autoFocus
          />
          <FormControl style={{ width: '100%' }}>
            <FormLabel htmlFor="jsonInput">{'JSON for: {saveId}'}</FormLabel>
            <TextareaAutosize
              id="jsonInput"
              minRows={2}
              maxRows={20}
              value={jsonData}
              style={{
                resize: 'none',
                width: '95%',
                backgroundColor: POPOVER_BACK_COLOR,
              }}
              onChange={(event) => setJsonData(event.target.value)}
            />
          </FormControl>
        </Stack>
      }
      actions={
        <ToolbarShareActions
          jsonData={jsonData}
          setJsonData={setJsonData}
          defaultJsonData={defaultJsonData}
        />
      }
    />
  );
};
