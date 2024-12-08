import { FC } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { useStore } from 'zustand';
import { Stack } from '@mui/material';
import {
  DeleteOutline,
  FolderOutlined,
  SearchOutlined,
  SettingsOutlined,
  ShareOutlined,
  UndoOutlined,
  DownloadOutlined,
} from '@mui/icons-material';

import { colorMap, Colors, ToolConfig, ToolConfigIDs } from 'types';
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

export const ToolbarActionIcon: FC = () => {
  const { undo: undoAction, pastStates } = useStore(useMainStore.temporal);
  const actionsLength = pastStates.length;

  const actionConfig: ToolConfig = {
    id: ToolConfigIDs.UNDO,
    tooltip: `Undo (moves: ${actionsLength}/10)`,
    color: colorMap[Colors.PINK],
    icon: <UndoOutlined />,
    value: actionsLength < 1,
    valueModifier: () => undoAction(),
    badge: actionsLength > 0 ? actionsLength : null,
    enabled: true,
    shortcut: 'U',
  };

  return <ToolbarIcon config={actionConfig} index={6} />;
};

const useGetElemName = () => {
  const selected = useAtomValue(selectedAtom);
  const isCover = useMainStore((state) => state.isCover);
  const isGroup = useMainStore((state) => state.isGroup);
  const isArrow = useMainStore((state) => state.isArrow);
  if (!selected) return '';

  if (isCover(selected.id)) return '(cover)';
  if (isGroup(selected.id)) return '(group)';
  if (isArrow(selected.id)) return '(arrow)';

  return '';
};

export const Toolbar: FC<ToolbarProps> = ({ takeScreenshot, createGroup }) => {
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
  const { coverSizeWidth, padding } = useGetSizesContext();

  const removeCoverAndRelatedArrows = useMainStore(
    (state) => state.removeCoverAndRelatedArrows,
  );
  const removeGroupAndRelatedArrows = useMainStore(
    (state) => state.removeGroupAndRelatedArrows,
  );

  const isCover = useMainStore((state) => state.isCover);
  const isGroup = useMainStore((state) => state.isGroup);
  const isArrow = useMainStore((state) => state.isArrow);

  const elemName = useGetElemName();

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
      icon: <SearchOutlined />,
      value: openSearch,
      valueModifier: setOpenSearch,
      badge: coversLength > 0 ? coversLength : null,
      enabled: true,
      shortcut: 'A',
    },
    {
      id: ToolConfigIDs.CONFIG,
      tooltip: `Options (scale: ${configSize})`,
      color: colorMap[Colors.PURPLE],
      icon: <SettingsOutlined />,
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
      icon: <ShareOutlined />,
      value: openShare,
      valueModifier: setOpenShare,
      badge: savesNumber === 1 ? null : savesNumber,
      enabled: true,
      shortcut: 'S',
    },
    {
      id: ToolConfigIDs.GROUP,
      tooltip: `Create group (groups: ${groupsLength})`,
      color: colorMap[Colors.YELLOW],
      icon: <FolderOutlined />,
      value: false,
      valueModifier: createGroup,
      badge: groupsLength > 0 ? groupsLength : null,
      enabled: true,
      shortcut: 'G',
    },
    {
      id: ToolConfigIDs.DELETE,
      tooltip: `Delete selected ${elemName}`,
      color: colorMap[Colors.RED],
      icon: <DeleteOutline />,
      value: !selected,
      valueModifier: deleteElem,
      badge: elemName !== '' ? elemName[1] : null,
      enabled: !!selected,
      shortcut: 'D',
    },
    {
      id: ToolConfigIDs.SCREENSHOT,
      tooltip: `Download board (elems: ${
        groupsLength + coversLength + ArrowsLength
      })`,
      color: colorMap[Colors.ORANGE],
      icon: <DownloadOutlined />,
      value: !!editArrows || !!selected,
      valueModifier: takeScreenshot,
      badge:
        groupsLength + coversLength + ArrowsLength > 0
          ? groupsLength + coversLength + ArrowsLength
          : null,
      enabled: !editArrows && !selected,
      shortcut: 'C',
    },
  ];

  return (
    <Stack
      direction={isLandscape ? 'column' : 'row'}
      gap={`${padding}px`}
      border={`3px solid ${color}`}
      padding={`${padding}px`}>
      {configTools.map((config, index) => (
        <ToolbarIcon config={config} key={config.id} index={index} />
      ))}
      <ToolbarActionIcon />
    </Stack>
  );
};
