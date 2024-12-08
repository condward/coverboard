import { FC } from 'react';
import { Chip, Stack, Box } from '@mui/material';
import { CancelRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { ToolConfigIDs, AppSchema, Media, mediaMap, SPACING_GAP } from 'types';
import {
  addPrefix,
  DEFAULT_KEY,
  DEFAULT_STORAGE,
  removePrefix,
  useSaveId,
} from 'utils';
import { useMainStore, useToastStore } from 'store';

const getMediaFromStorage = (storageString: string) => {
  try {
    const item = window.localStorage.getItem(storageString);
    if (item) {
      const curentData = JSON.parse(item) as { state: AppSchema };

      if (Object.values(Media).includes(curentData.state.configs.media)) {
        return curentData.state.configs.media;
      }
    }

    return Media.MUSIC;
  } catch {
    console.error('Could not parse media type');
    return Media.MUSIC;
  }
};

interface ToolbarShareProps {
  onClose: () => void;
  setJsonData: React.Dispatch<React.SetStateAction<string>>;
  setKeyList: React.Dispatch<React.SetStateAction<string[]>>;
  keyList: Array<string>;
}

export const ToolbarSharePages: FC<ToolbarShareProps> = ({
  onClose,
  setJsonData,
  keyList,
  setKeyList,
}) => {
  const navigate = useNavigate();
  const showSuccessMessage = useToastStore((state) => state.showSuccessMessage);
  const saveId = useSaveId();
  const resetStoreValues = useMainStore((state) => state.resetStoreValues);

  const hasDefault = !!window.localStorage.getItem(addPrefix(DEFAULT_KEY));

  const handleDeleteElements = () => {
    resetStoreValues();
    showSuccessMessage('All elements on screen were cleaned');
  };

  return (
    <>
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={SPACING_GAP / 2}
        role="radiogroup"
        aria-labelledby="chip-group-label">
        {keyList.map((currentSaveWithPrefix) => {
          const currentSave = removePrefix(currentSaveWithPrefix);
          const showDelete =
            currentSave !== DEFAULT_KEY ||
            (currentSave === saveId && hasDefault);

          const currentMedia = getMediaFromStorage(currentSaveWithPrefix);

          return (
            <Chip
              role="radio"
              aria-checked={saveId === currentSave}
              key={currentSave}
              label={`${mediaMap[currentMedia].emoji} ${currentSave}`}
              color={saveId === currentSave ? 'primary' : 'default'}
              onClick={async () => {
                await navigate(`/${currentSave}#${ToolConfigIDs.SHARE}`);
                const data = window.localStorage.getItem(
                  addPrefix(currentSave),
                );
                if (data) {
                  setJsonData(JSON.stringify(JSON.parse(data).state, null, 4));
                }
              }}
              onDelete={
                showDelete
                  ? async (evt) => {
                      evt.preventDefault();

                      if (saveId === DEFAULT_KEY && currentSave === saveId) {
                        handleDeleteElements();
                        onClose();
                        return;
                      }

                      window.localStorage.removeItem(addPrefix(currentSave));
                      setKeyList((keys) =>
                        keys.filter(
                          (currentKey) => currentKey !== addPrefix(currentSave),
                        ),
                      );

                      if (saveId === currentSave) {
                        await navigate(
                          `/${DEFAULT_KEY}#${ToolConfigIDs.SHARE}`,
                        );

                        const defaultData =
                          window.localStorage.getItem(DEFAULT_STORAGE);
                        if (defaultData) {
                          setJsonData(
                            JSON.stringify(
                              JSON.parse(defaultData).state,
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
                  <Box sx={{ display: 'flex' }} title="delete page">
                    <CancelRounded />
                  </Box>
                ) : undefined
              }
            />
          );
        })}
      </Stack>
    </>
  );
};
