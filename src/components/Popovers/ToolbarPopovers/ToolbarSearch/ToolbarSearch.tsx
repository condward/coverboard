import { FC } from 'react';

import { mediaMap } from 'types';
import { useGetApiKey, useMainStore } from 'store';

import { ToolbarApiKeyPopover } from './ToolbarApiKeyPopover';
import { ToolbarSearchPopover } from './ToobarSearchPopover';

export const ToolbarSearch: FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const media = useMainStore((state) => state.configs.media);
  const apiName = mediaMap[media].apiName;
  const apiKey = useGetApiKey(apiName);

  if (apiName === null || apiKey) {
    return <ToolbarSearchPopover onClose={onClose} />;
  }

  return <ToolbarApiKeyPopover onClose={onClose} apiName={apiName} />;
};
