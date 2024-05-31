import { FC } from 'react';
import { Button, Stack, Tooltip } from '@mui/material';
import { ZodError } from 'zod';

import { useToastStore } from 'store';
import { useSaveId } from 'utils';
import { SPACING_GAP } from 'components';
import { BackColors, Colors, Media, appSchema } from 'types';

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
  setJsonData: React.Dispatch<React.SetStateAction<string>>;
}

export const ToolbarShareActions: FC<ToolbarShareActionsProps> = ({
  jsonData,
  setJsonData,
  defaultJsonData,
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
        showErrorMessage(JSON.parse(error.message)[0].message);
        return;
      }
      showErrorMessage('JSON data is not valid');
    }
  };

  return (
    <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
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
        <Button variant="outlined" color="info" type="button">
          Info
        </Button>
      </Tooltip>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleCopyText}
        disabled={!isValidJSON}>
        Copy
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={exportData}
        disabled={!isValidJSON}>
        Download
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        disabled={defaultJsonData === jsonData}
        onClick={() => setJsonData(defaultJsonData)}>
        Reset
      </Button>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isValidJSON}>
        Submit
      </Button>
    </Stack>
  );
};
