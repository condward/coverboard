import { FC } from 'react';
import { Button, Stack } from '@mui/material';
import { ZodError } from 'zod';
import {
  DownloadOutlined,
  FolderCopyOutlined,
  RefreshOutlined,
  SaveOutlined,
} from '@mui/icons-material';

import { useToastStore } from 'store';
import { useSaveId } from 'utils';
import { appSchema, SPACING_GAP } from 'types';

const isValidJSONFn = (jsonData: string) => {
  try {
    JSON.parse(jsonData);
    return true;
  } catch (error) {
    return false;
  }
};

interface ToolbarShareActionsProps {
  jsonData: string;
  defaultJsonData: string;
  showButtons: boolean;
  setJsonData: React.Dispatch<React.SetStateAction<string>>;
}

export const ToolbarShareActions: FC<ToolbarShareActionsProps> = ({
  jsonData,
  setJsonData,
  defaultJsonData,
  showButtons,
}) => {
  const saveId = useSaveId();
  const showSuccessMessage = useToastStore((state) => state.showSuccessMessage);
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);

  const isValidJSON = isValidJSONFn(jsonData);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(jsonData);
      handleCopy(true);
    } catch {
      handleCopy(false);
    }
  };

  const handleCopy = (success: boolean) => {
    success
      ? showSuccessMessage('Text copied with success')
      : showErrorMessage('Error copying text');
  };

  const exportData = () => {
    try {
      appSchema.parse(JSON.parse(jsonData));
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        jsonData,
      )}`;
      const link = document.createElement('a');
      link.href = jsonString;
      link.download = `${saveId}.json`;

      link.click();
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
    <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
      {showButtons && (
        <>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCopyText}
            disabled={!isValidJSON}
            startIcon={<FolderCopyOutlined />}>
            Copy
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={exportData}
            startIcon={<DownloadOutlined />}
            disabled={!isValidJSON}>
            Export
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            disabled={defaultJsonData === jsonData}
            startIcon={<RefreshOutlined />}
            onClick={() => setJsonData(defaultJsonData)}>
            Reset
          </Button>
        </>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<SaveOutlined />}
        disabled={
          showButtons && (!isValidJSON || defaultJsonData === jsonData)
        }>
        Save
      </Button>
    </Stack>
  );
};
