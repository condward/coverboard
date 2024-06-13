import { FC, memo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { useStore } from 'zustand';
import { Stack } from '@mui/material';

import {
  colorMap,
  Colors,
  SPACING_GAP,
  ToolConfig,
  ToolConfigIDs,
} from 'types';
import { haxPrefix, useIsLandscape } from 'utils';

import {
  useMainStore,
  configAtom,
  searchAtom,
  shareAtom,
  pointsAtom,
  selectedAtom,
} from 'store';
import { useGetSizesContext } from 'providers';

import { ToolbarIcon } from '.';

interface ToolbarProps {
  takeScreenshot: () => void;
  createGroup: () => void;
}

const ToolbarActionIcon: FC = () => {
  const { undo: undoAction, pastStates } = useStore(useMainStore.temporal);
  const actionsLength = pastStates.length;

  const actionConfig: ToolConfig = {
    id: ToolConfigIDs.UNDO,
    tooltip: `Undo (moves: ${actionsLength}/10)`,
    color: colorMap[Colors.PINK],
    emoji: '↩️',
    value: actionsLength < 1,
    valueModifier: () => undoAction(),
    badge: actionsLength,
    enabled: true,
    shortcut: 'U',
  };

  return <ToolbarIcon config={actionConfig} index={6} />;
};

const ToolbarWithoutMemo: FC<ToolbarProps> = ({
  takeScreenshot,
  createGroup,
}) => {
  const isLandscape = useIsLandscape();
  const color = useMainStore((state) => state.getColor());
  const editArrows = useAtomValue(pointsAtom);
  const [openConfig, setOpenConfig] = useAtom(configAtom);
  const [openSearch, setOpenSearch] = useAtom(searchAtom);
  const [openShare, setOpenShare] = useAtom(shareAtom);
  const [selected, setSelected] = useAtom(selectedAtom);
  const coversLength = useMainStore((state) => state.covers.length);
  const groupsLength = useMainStore((state) => state.groups.length);
  const ArrowsLength = useMainStore((state) => state.arrows.length);
  const { coverSizeWidth } = useGetSizesContext();

  const removeCoverAndRelatedArrows = useMainStore(
    (state) => state.removeCoverAndRelatedArrows,
  );
  const removeGroupAndRelatedArrows = useMainStore(
    (state) => state.removeGroupAndRelatedArrows,
  );

  const isCover = useMainStore((state) => state.isCover);
  const isGroup = useMainStore((state) => state.isGroup);
  const isArrow = useMainStore((state) => state.isArrow);

  const getElemName = () => {
    if (!selected) return '';

    if (isCover(selected.id)) return '(cover)';
    if (isGroup(selected.id)) return '(group)';
    if (isArrow(selected.id)) return '(arrow)';

    return '';
  };

  const removeArrow = useMainStore((state) => state.removeArrow);
  const deleteElem = () => {
    if (!selected) return;

    if (isGroup(selected.id)) {
      removeGroupAndRelatedArrows(selected.id);
    } else if (isCover(selected.id)) {
      removeCoverAndRelatedArrows(selected.id);
    } else if (isArrow(selected.id)) {
      removeArrow(selected.id);
    }
    setSelected(null);
  };

  const savesNumber = Object.keys(window.localStorage).filter((key) =>
    haxPrefix(key),
  ).length;
  const configSize = coverSizeWidth / 100;

  const configTools: Array<ToolConfig> = [
    {
      id: ToolConfigIDs.SEARCH,
      tooltip: `Search and add (covers: ${coversLength})`,
      color: colorMap[Colors.GREEN],
      emoji: '🔍',
      value: openSearch,
      valueModifier: setOpenSearch,
      badge: coversLength,
      enabled: true,
      shortcut: 'A',
    },
    {
      id: ToolConfigIDs.CONFIG,
      tooltip: `Options (scale: ${configSize})`,
      color: colorMap[Colors.PURPLE],
      emoji: '⚙️',
      value: openConfig,
      valueModifier: setOpenConfig,
      badge: configSize === 1 ? 0 : configSize,
      enabled: true,
      shortcut: 'O',
    },
    {
      id: ToolConfigIDs.SHARE,
      tooltip: `Share and save (saves: ${savesNumber})`,
      color: colorMap[Colors.BLUE],
      emoji: '🔗',
      value: openShare,
      valueModifier: setOpenShare,
      badge: savesNumber === 1 ? 0 : savesNumber,
      enabled: true,
      shortcut: 'S',
    },
    {
      id: ToolConfigIDs.GROUP,
      tooltip: `Create group (groups: ${groupsLength})`,
      color: colorMap[Colors.YELLOW],
      emoji: '📁',
      value: false,
      valueModifier: createGroup,
      badge: groupsLength,
      enabled: true,
      shortcut: 'G',
    },
    {
      id: ToolConfigIDs.DELETE,
      tooltip: `Delete selected ${getElemName()}`,
      color: colorMap[Colors.RED],
      emoji: '🗑️',
      value: !selected,
      valueModifier: deleteElem,
      badge: groupsLength + coversLength + ArrowsLength,
      enabled: !!selected,
      shortcut: 'D',
    },
    {
      id: ToolConfigIDs.SCREENSHOT,
      tooltip: `Download board (elems: ${
        groupsLength + coversLength + ArrowsLength
      })`,
      color: colorMap[Colors.ORANGE],
      emoji: '📷',
      value: !!editArrows || !!selected,
      valueModifier: takeScreenshot,
      badge: groupsLength + coversLength + ArrowsLength,
      enabled: !editArrows && !selected,
      shortcut: 'C',
    },
  ];

  return (
    <Stack
      direction={isLandscape ? 'column' : 'row'}
      gap={SPACING_GAP}
      border={`2px solid ${color}`}
      padding={2}>
      {configTools.map((config, index) => (
        <ToolbarIcon config={config} key={config.id} index={index} />
      ))}
      <ToolbarActionIcon />
    </Stack>
  );
};

export const Toolbar = memo(ToolbarWithoutMemo);
