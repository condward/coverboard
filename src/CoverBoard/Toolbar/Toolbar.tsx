import {
  ToolbarSearch,
  ToolbarShare,
  ToolbarConfig,
  ToolbarIcon,
  ToolbarTooltip,
} from '.';
import { colorMap, Colors, ToolConfig, ToolConfigIDs } from 'types';
import { haxPrefix } from 'utils';
import { useUtilsStore, useMainStore, useToolbarStore } from 'store';
import React, { useCallback, useMemo } from 'react';
import { shallow } from 'zustand/shallow';
import { v4 as uuidv4 } from 'uuid';
import { useKeysListener } from 'CoverBoard';

interface ToolbarProps {
  takeScreenshot: () => void;
  showTooltips: boolean;
}

const ToolbarActionIcon: React.FC = () => {
  const actionsLength = useMainStore((state) => state.actions.length);
  const undoAction = useMainStore((state) => state.undoAction);

  const actionConfig = useMemo<ToolConfig>(
    () => ({
      id: ToolConfigIDs.UNDO,
      tooltip: `Undo (moves: ${actionsLength}/10)`,
      color: colorMap[Colors.PINK],
      emoji: '↩️',
      value: actionsLength < 1,
      valueModifier: undoAction,
      badge: actionsLength,
      enabled: true,
      shortcut: 'U',
    }),
    [actionsLength, undoAction],
  );

  return <ToolbarIcon config={actionConfig} index={6} />;
};

export const ToolbarMemo: React.FC<ToolbarProps> = ({
  takeScreenshot,
  showTooltips,
}) => {
  const editLines = useUtilsStore((state) => state.points);
  const [openConfig, setOpenConfig] = useToolbarStore(
    (state) => [state.openConfig, state.setOpenConfig],
    shallow,
  );
  const [openSearch, setOpenSearch] = useToolbarStore(
    (state) => [state.openSearch, state.setOpenSearch],
    shallow,
  );
  const [openShare, setOpenShare] = useToolbarStore(
    (state) => [state.openShare, state.setOpenShare],
    shallow,
  );
  const setSelected = useUtilsStore((state) => state.setSelected);

  const selected = useUtilsStore((state) => state.selected);
  const coversLength = useMainStore((state) => state.covers.length);
  const groupsLength = useMainStore((state) => state.groups.length);
  const linesLength = useMainStore((state) => state.lines.length);
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const addGroups = useMainStore((state) => state.addGroups);
  const groupDir = useMainStore((state) => state.configs.groupDir);

  const createGroup = useCallback(() => {
    const id = uuidv4();
    addGroups([
      {
        id,
        x: 0,
        y: 0,
        title: { text: null, dir: groupDir },
        subtitle: { text: null, dir: groupDir },
        scaleX: 3,
        scaleY: 3,
      },
    ]);
    setSelected({ id, open: false });
  }, [addGroups, groupDir, setSelected]);

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
  const deleteElem = useCallback(() => {
    if (!selected) return;

    if (isGroup(selected.id)) {
      removeGroupAndRelatedLines(selected.id);
    } else if (isCover(selected.id)) {
      removeCoverAndRelatedLines(selected.id);
    } else if (isLine(selected.id)) {
      removeLine(selected.id);
    }
  }, [
    isCover,
    isGroup,
    isLine,
    removeCoverAndRelatedLines,
    removeGroupAndRelatedLines,
    removeLine,
    selected,
  ]);

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

  useKeysListener({ createGroup, takeScreenshot });

  return (
    <>
      {openSearch && <ToolbarSearch />}
      {openConfig && <ToolbarConfig />}
      {openShare && <ToolbarShare />}
      {configTools.map((config, index) => (
        <ToolbarIcon config={config} key={config.id} index={index} />
      ))}
      <ToolbarActionIcon />
      {showTooltips && <ToolbarTooltip />}
    </>
  );
};

export const Toolbar = React.memo(ToolbarMemo);
