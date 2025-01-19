import { FC } from 'react';
import { useAtom } from 'jotai';
import { SettingsOutlined } from '@mui/icons-material';

import { colorMap, Colors, KeyboardShortcuts, ToolConfigIDs } from 'types';

import { configAtom } from 'store';

import { useGetSizesContext } from 'providers';

import { CommonButton } from './CommonButton';

export const ConfigButton: FC = () => {
  const { coverSizeWidth } = useGetSizesContext();
  const [openConfig, setOpenConfig] = useAtom(configAtom);
  const configSize = coverSizeWidth / 100;

  return (
    <CommonButton
      config={{
        id: ToolConfigIDs.CONFIG,
        tooltip: `Options (scale: ${configSize})`,
        color: colorMap[Colors.PURPLE],
        icon: <SettingsOutlined />,
        value: openConfig,
        valueModifier: setOpenConfig,
        badge: configSize === 1 ? 0 : configSize,
        enabled: true,
        shortcut: KeyboardShortcuts.CONFIG,
      }}
    />
  );
};
