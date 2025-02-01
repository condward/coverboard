import { FC } from 'react';
import { useAtomValue } from 'jotai';
import { DownloadOutlined } from '@mui/icons-material';

import { colorMap, Colors, KeyboardShortcuts, ToolConfigIDs } from 'types';

import { pointsAtom, selectedAtom, useShallowMainStore } from 'store';

import { CommonButton } from './CommonButton';

export const ScreenshotButton: FC<{ takeScreenshot: () => void }> = ({
  takeScreenshot,
}) => {
  const { coversLength, groupsLength, arrowsLength } = useShallowMainStore(
    (state) => ({
      coversLength: state.covers.length,
      groupsLength: state.groups.length,
      arrowsLength: state.arrows.length,
    }),
  );
  const editArrows = useAtomValue(pointsAtom);
  const selected = useAtomValue(selectedAtom);

  return (
    <CommonButton
      config={{
        id: ToolConfigIDs.SCREENSHOT,
        tooltip: `Download board (elems: ${
          groupsLength + coversLength + arrowsLength
        })`,
        color: colorMap[Colors.ORANGE],
        icon: <DownloadOutlined />,
        value: !!editArrows || !!selected,
        valueModifier: takeScreenshot,
        badge:
          groupsLength + coversLength + arrowsLength > 0
            ? groupsLength + coversLength + arrowsLength
            : null,
        enabled: !editArrows && !selected,
        shortcut: KeyboardShortcuts.SCREENSHOT,
      }}
    />
  );
};
