import { FC, FormEvent, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  TextareaAutosize,
  Tooltip,
} from '@mui/material';
import { ZodError } from 'zod';
import { useNavigate } from 'react-router-dom';
import { InfoOutlined } from '@mui/icons-material';

import {
  ToolConfigIDs,
  appSchema,
  POPOVER_BACK_COLOR,
  SPACING_GAP,
  BackColors,
  Colors,
  Media,
} from 'types';
import { CommonDialog, FieldSet } from 'components';
import { DEFAULT_KEY, addPrefix, haxPrefix, useSaveId } from 'utils';

import { useShallowMainStore, useShowToast } from 'store';

import { ToolbarSharePages } from './ToobarSharePages';
import { ToolbarShareActions } from './ToolbarShareActions';

export const ToolbarSharePopover: FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const navigate = useNavigate();
  const saveId = useSaveId();

  const { showSuccessMessage, showErrorMessage } = useShowToast();
  const { defaultJsonData, updateStoreValues } = useShallowMainStore(
    (state) => ({
      updateStoreValues: state.updateStoreValues,
      defaultJsonData: JSON.stringify(state.getStoreValues(), null, 4),
    }),
  );

  const [jsonData, setJsonData] = useState(defaultJsonData);
  const [newSave, setNewSave] = useState('');
  const pages = [
    DEFAULT_KEY,
    ...Object.keys(window.localStorage).filter(
      (key) => key !== addPrefix(DEFAULT_KEY) && haxPrefix(key),
    ),
  ];
  const [keyList, setKeyList] = useState(pages);

  const handleImport = async (evt: FormEvent) => {
    evt.preventDefault();
    const value = newSave.trim();

    if (value) {
      await navigate(`/${value}`);
      onClose();
      return;
    }

    try {
      const parsedSchema = appSchema.parse(JSON.parse(jsonData));

      updateStoreValues(parsedSchema);

      onClose();
      showSuccessMessage('JSON was applied with success');
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = JSON.parse(error.message) as Array<{
          message: string;
        }>;
        showErrorMessage(messages[0].message);
        return;
      }
      showErrorMessage('JSON data is not valid');
    }
  };

  return (
    <CommonDialog
      onClose={onClose}
      onSubmit={(evt) => handleImport(evt)}
      title="Share and save"
      hash={ToolConfigIDs.SHARE}
      header={
        <Tooltip
          title={
            <>
              <h3>Colors</h3>
              <p>{Object.values(Colors).map((color) => `${color} `)}</p>
              <h3>Background Colors</h3>
              <p>{Object.values(BackColors).map((color) => `${color} `)}</p>
              <h3>Directions</h3>
              <p>left right top bottom</p>
              <h3>Media</h3>
              <p>{Object.values(Media).map((color) => `${color} `)}</p>
            </>
          }>
          <Button
            variant="outlined"
            color="info"
            type="button"
            startIcon={<InfoOutlined />}>
            Config Types
          </Button>
        </Tooltip>
      }
      content={
        <Stack direction="column" gap={SPACING_GAP}>
          <TextField
            fullWidth
            disabled={pages.length > 15}
            label={pages.length > 15 ? 'Only 15 pages allowed' : 'Add new page'}
            onChange={(evt) => setNewSave(evt.target.value.trim())}
            value={newSave}
            sx={{ mt: '0.4rem' }}
            autoFocus
          />
          {newSave === '' && (
            <FieldSet direction="row" label="Pick a page">
              <ToolbarSharePages
                onClose={onClose}
                setJsonData={setJsonData}
                keyList={keyList}
                setKeyList={setKeyList}
              />
              <FormControl style={{ width: '100%' }}>
                <FormLabel htmlFor="jsonInput">{`JSON for: ${saveId}`}</FormLabel>
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
            </FieldSet>
          )}
        </Stack>
      }
      actions={
        <ToolbarShareActions
          showButtons={newSave === ''}
          jsonData={jsonData}
          setJsonData={setJsonData}
          defaultJsonData={defaultJsonData}
        />
      }
    />
  );
};
