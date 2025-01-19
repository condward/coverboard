import { FC } from 'react';
import { useAtom } from 'jotai';
import { ShareOutlined } from '@mui/icons-material';

import { colorMap, Colors, KeyboardShortcuts, ToolConfigIDs } from 'types';

import { shareAtom } from 'store';
import { haxPrefix } from 'utils';

import { CommonButton } from './CommonButton';

export const ShareButton: FC = () => {
  const savesNumber = Object.keys(window.localStorage).filter((key) =>
    haxPrefix(key),
  ).length;
  const [openShare, setOpenShare] = useAtom(shareAtom);

  return (
    <CommonButton
      config={{
        id: ToolConfigIDs.SHARE,
        tooltip: `Share and save (saves: ${savesNumber})`,
        color: colorMap[Colors.BLUE],
        icon: <ShareOutlined />,
        value: openShare,
        valueModifier: setOpenShare,
        badge: savesNumber === 1 ? null : savesNumber,
        enabled: true,
        shortcut: KeyboardShortcuts.SHARE,
      }}
    />
  );
};
