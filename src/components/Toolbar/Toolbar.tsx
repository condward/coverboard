import { FC, useCallback } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Stack } from '@mui/material';
import {
  DeleteOutline,
  FolderOutlined,
  SearchOutlined,
  SettingsOutlined,
  ShareOutlined,
  DownloadOutlined,
} from '@mui/icons-material';
import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import {
  colorMap,
  Colors,
  KeyboardShortcuts,
  ToolConfig,
  ToolConfigIDs,
} from 'types';
import { haxPrefix, useIsLandscape } from 'utils';

import {
  useShallowMainStore,
  configAtom,
  searchAtom,
  shareAtom,
  pointsAtom,
  selectedAtom,
  useToastStore,
} from 'store';
import { useGetSizesContext } from 'providers';

import { ToolbarActionIcon, ToolbarIcon } from '.';

interface ToolbarProps {
  takeScreenshot: () => void;
}

const useGetElemName = () => {
  const { isCover, isGroup, isArrow } = useShallowMainStore((state) => ({
    isCover: state.isCover,
    isGroup: state.isGroup,
    isArrow: state.isArrow,
  }));

  const selected = useAtomValue(selectedAtom);

  if (!selected) return '';

  if (isCover(selected.id)) return '(cover)';
  if (isGroup(selected.id)) return '(group)';
  if (isArrow(selected.id)) return '(arrow)';

  return '';
};

const useCreateGroup = () => {
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const { groupTitleDir, groupSubTitleDir, addGroups } = useShallowMainStore(
    (state) => ({
      groupTitleDir: state.configs.groups.title.dir,
      groupSubTitleDir: state.configs.groups.subtitle.dir,
      addGroups: state.addGroups,
    }),
  );

  const setSelected = useSetAtom(selectedAtom);

  return {
    createGroup: useCallback(() => {
      const id = uuidv4();
      try {
        addGroups([
          {
            id,
            pos: {
              x: 0,
              y: 0,
            },
            title: { text: '', dir: groupTitleDir },
            subtitle: { text: '', dir: groupSubTitleDir },
            scale: {
              x: 3,
              y: 3,
            },
          },
        ]);
        setSelected({ id, open: false });
      } catch (error) {
        if (error instanceof ZodError) {
          const tooBig = error.issues.find((msg) => msg.code === 'too_big');

          if (tooBig) {
            showErrorMessage(tooBig.message);
            return;
          }
          showErrorMessage('Bad formatted group');
          return;
        }
        throw error;
      }
    }, [
      addGroups,
      groupSubTitleDir,
      groupTitleDir,
      setSelected,
      showErrorMessage,
    ]),
  };
};

export const Toolbar: FC<ToolbarProps> = ({ takeScreenshot }) => {
  const isLandscape = useIsLandscape();
  const elemName = useGetElemName();
  const { coverSizeWidth, padding } = useGetSizesContext();

  const {
    color,
    coversLength,
    groupsLength,
    arrowsLength,
    isArrow,
    isCover,
    isGroup,
    removeArrow,
    removeCoverAndRelatedArrows,
    removeGroupAndRelatedArrows,
  } = useShallowMainStore((state) => ({
    color: state.getColor(),
    coversLength: state.covers.length,
    groupsLength: state.groups.length,
    arrowsLength: state.arrows.length,
    isCover: state.isCover,
    isGroup: state.isGroup,
    isArrow: state.isArrow,
    removeArrow: state.removeArrow,
    removeCoverAndRelatedArrows: state.removeCoverAndRelatedArrows,
    removeGroupAndRelatedArrows: state.removeGroupAndRelatedArrows,
  }));

  const [openConfig, setOpenConfig] = useAtom(configAtom);
  const [openSearch, setOpenSearch] = useAtom(searchAtom);
  const [openShare, setOpenShare] = useAtom(shareAtom);
  const [selected, setSelected] = useAtom(selectedAtom);
  const editArrows = useAtomValue(pointsAtom);

  const { createGroup } = useCreateGroup();

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
      shortcut: KeyboardShortcuts.SEARCH,
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
      shortcut: KeyboardShortcuts.CONFIG,
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
      shortcut: KeyboardShortcuts.SHARE,
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
      shortcut: KeyboardShortcuts.GROUP,
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
      shortcut: KeyboardShortcuts.DELETE,
    },
    {
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
