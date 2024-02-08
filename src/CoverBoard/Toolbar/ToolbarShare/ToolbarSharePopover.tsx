import React, { useState, useMemo } from 'react';
import {
  Grid,
  TextareaAutosize,
  Button,
  Chip,
  Typography,
  TextField,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import {
  ToolConfigIDs,
  DEFAULT_KEY,
  LocalStorageData,
  Media,
  MediaMap,
} from 'types';
import { NavigateFunction } from 'react-router-dom';
import { addPrefix, DEFAULT_STORAGE, haxPrefix, removePrefix } from 'utils';
import { CommonDialog } from 'components';
import { useMainStore } from 'store';

interface SaveProps {
  open: boolean;
  onClose: () => void;
  handleImport: (data: string) => void;
  handleCopy: (success: boolean) => void;
  navigate: NavigateFunction;
  handleDeleteElements: () => void;
}

const getMediaFromStorage = (storageString: string) => {
  try {
    const item = window.localStorage.getItem(storageString);
    if (item) {
      const curentData: LocalStorageData = JSON.parse(item);

      if (Object.values(Media).includes(curentData.configs.media)) {
        return curentData.configs.media;
      }
    }

    return Media.MUSIC;
  } catch (err) {
    console.error('Could not parse media type');
    return Media.MUSIC;
  }
};

export const ToolbarSharePopover: React.FC<SaveProps> = ({
  open,
  onClose,
  handleImport,
  handleCopy,
  navigate,
  handleDeleteElements,
}) => {
  const instance = useMainStore((state) => state.getStoreValues());
  const saveId = useMainStore((state) => state.saveId);
  const [jsonData, setJsonData] = useState(JSON.stringify(instance, null, 4));
  const [storage, setStorage] = useState(window.localStorage);
  const [newSave, setNewSave] = useState('');
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCopyText = () => {
    try {
      navigator.clipboard.writeText(jsonData);
      handleCopy(true);
    } catch (err) {
      handleCopy(false);
    }
  };

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      jsonData,
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `${saveId}.json`;

    link.click();
  };

  const handTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(event.target.value);
  };

  const isValidJSON = useMemo(() => {
    try {
      JSON.parse(jsonData);
      return true;
    } catch (err) {
      return false;
    }
  }, [jsonData]);

  const keyList = [
    DEFAULT_KEY,
    ...Object.keys(storage).filter(
      (key) => key !== addPrefix(DEFAULT_KEY) && haxPrefix(key),
    ),
  ];

  const hasDefault = window.localStorage.getItem(addPrefix(DEFAULT_KEY));

  const handleCreateNewSave = () => {
    const value = newSave.trim();

    if (value) {
      navigate(`/${newSave}`);
      // navigate
      setNewSave('');
      onClose();
    }
  };

  return (
    <CommonDialog
      onClose={onClose}
      open={open}
      title="Share and save"
      hash={ToolConfigIDs.SHARE}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography gutterBottom>Pick a page:</Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {keyList.map((currentSaveWithPrefix) => {
              const currentSave = removePrefix(currentSaveWithPrefix);
              const showDelete =
                currentSave !== DEFAULT_KEY ||
                (currentSave === saveId && hasDefault);

              const currentMedia = getMediaFromStorage(currentSaveWithPrefix);

              return (
                <Chip
                  key={currentSave}
                  label={`${MediaMap[currentMedia].emoji} ${currentSave}`}
                  color={saveId === currentSave ? 'primary' : 'default'}
                  onClick={() => {
                    navigate(`/${currentSave}#${ToolConfigIDs.SHARE}`);
                    const data = window.localStorage.getItem(
                      addPrefix(currentSave),
                    );
                    if (data) {
                      setJsonData(JSON.stringify(JSON.parse(data), null, 4));
                    }
                  }}
                  onDelete={
                    showDelete
                      ? (evt) => {
                          evt.preventDefault();

                          if (
                            saveId === DEFAULT_KEY &&
                            currentSave === saveId
                          ) {
                            handleDeleteElements();
                            onClose();
                            return;
                          }

                          window.localStorage.removeItem(
                            addPrefix(currentSave),
                          );
                          setStorage((prevStorage) => {
                            const prevStorageCopy = { ...prevStorage };
                            delete prevStorageCopy[addPrefix(currentSave)];

                            return prevStorageCopy;
                          });

                          if (saveId === currentSave) {
                            navigate(`/${DEFAULT_KEY}#${ToolConfigIDs.SHARE}`);

                            const defaultData =
                              window.localStorage.getItem(DEFAULT_STORAGE);
                            if (defaultData) {
                              setJsonData(
                                JSON.stringify(
                                  JSON.parse(defaultData),
                                  null,
                                  4,
                                ),
                              );
                            }
                          }
                        }
                      : undefined
                  }
                  deleteIcon={
                    showDelete ? (
                      <div style={{ display: 'flex' }} title="delete page">
                        <CloseIcon />
                      </div>
                    ) : undefined
                  }
                  style={{
                    marginRight: '4px',
                    marginBottom: '8px',
                    width: matches ? '48%' : '32%',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                />
              );
            })}
          </div>
        </Grid>
        <Grid item xs={12}>
          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              handleCreateNewSave();
            }}>
            <div style={{ display: 'flex', verticalAlign: 'middle' }}>
              <TextField
                label="Add new page"
                onChange={(evt) => setNewSave(evt.target.value.trim())}
                size="small"
                value={newSave}
                autoFocus
                style={{ marginRight: '10px' }}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={!newSave}
                onClick={handleCreateNewSave}
                style={{ marginRight: '20px', marginBottom: '20px' }}>
                Create
              </Button>
            </div>
          </form>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>JSON for: {saveId}</Typography>
          <TextareaAutosize
            value={jsonData}
            minRows={2}
            maxRows={20}
            style={{ resize: 'none', width: '95%' }}
            onChange={handTextChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleImport(jsonData)}
            disabled={!isValidJSON}
            style={{ marginRight: '20px', marginBottom: '20px' }}>
            Apply
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCopyText}
            style={{ marginRight: '20px', marginBottom: '20px' }}
            disabled={!isValidJSON}>
            Copy
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={exportData}
            style={{ marginRight: '20px', marginBottom: '20px' }}
            disabled={!isValidJSON}>
            Download
          </Button>
          <Button
            variant="outlined"
            color="primary"
            disabled={JSON.stringify(instance, null, 4) === jsonData}
            onClick={() => {
              setJsonData(JSON.stringify(instance, null, 4));
            }}
            style={{ marginRight: '20px', marginBottom: '20px' }}>
            Reset
          </Button>
        </Grid>
      </Grid>
    </CommonDialog>
  );
};
