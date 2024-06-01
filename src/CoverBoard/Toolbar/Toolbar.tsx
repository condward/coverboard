import { FC, memo } from 'react';

import { useAtom, useAtomValue } from 'jotai';
import { useStore } from 'zustand';

import { colorMap, Colors, ToolConfig, ToolConfigIDs } from 'types';
import { haxPrefix } from 'utils';

import {
  useMainStore,
  configAtom,
  searchAtom,
  shareAtom,
  pointsAtom,
  selectedAtom,
} from 'store';
import { useGetSizesContext } from 'providers';

import { ToolbarIcon, ToolbarTooltip } from '.';

interface ToolbarProps {
  takeScreenshot: () => void;
  createGroup: () => void;
  showTooltips: boolean;
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
  showTooltips,
  createGroup,
}) => {
  const editLines = useAtomValue(pointsAtom);
  const [openConfig, setOpenConfig] = useAtom(configAtom);
  const [openSearch, setOpenSearch] = useAtom(searchAtom);
  const [openShare, setOpenShare] = useAtom(shareAtom);
  const [selected, setSelected] = useAtom(selectedAtom);
  const coversLength = useMainStore((state) => state.covers.length);
  const groupsLength = useMainStore((state) => state.groups.length);
  const linesLength = useMainStore((state) => state.lines.length);
  const { coverSizeWidth } = useGetSizesContext();

  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );

  const isCover = useMainStore((state) => state.isCover);
  const isGroup = useMainStore((state) => state.isGroup);
  const isLine = useMainStore((state) => state.isLine);

  const getElemName = () => {
    if (!selected) return '';

    if (isCover(selected.id)) return '(cover)';
    if (isGroup(selected.id)) return '(group)';
    if (isLine(selected.id)) return '(arrow)';

    return '';
  };

  const removeLine = useMainStore((state) => state.removeLine);
  const deleteElem = () => {
    if (!selected) return;

    if (isGroup(selected.id)) {
      removeGroupAndRelatedLines(selected.id);
    } else if (isCover(selected.id)) {
      removeCoverAndRelatedLines(selected.id);
    } else if (isLine(selected.id)) {
      removeLine(selected.id);
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
      badge: groupsLength + coversLength + linesLength,
      enabled: !!selected,
      shortcut: 'D',
    },
    {
      id: ToolConfigIDs.SCREENSHOT,
      tooltip: `Download board (elems: ${
        groupsLength + coversLength + linesLength
      })`,
      color: colorMap[Colors.ORANGE],
      emoji: '📷',
      value: !!editLines || !showTooltips || !!selected,
      valueModifier: takeScreenshot,
      badge: groupsLength + coversLength + linesLength,
      enabled: showTooltips && !editLines && !selected,
      shortcut: 'C',
    },
  ];

  return (
    <>
      {configTools.map((config, index) => (
        <ToolbarIcon config={config} key={config.id} index={index} />
      ))}
      <ToolbarActionIcon />
      {showTooltips && <ToolbarTooltip />}
    </>
  );
};

export const Toolbar = memo(ToolbarWithoutMemo);
