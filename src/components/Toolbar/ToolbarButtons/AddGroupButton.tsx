import { FC } from 'react';
import { useSetAtom } from 'jotai';
import { FolderOutlined } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { ZodError } from 'zod';

import { colorMap, Colors, KeyboardShortcuts, ToolConfigIDs } from 'types';

import { selectedAtom, useShallowMainStore, useShowToast } from 'store';

import { CommonButton } from './CommonButton';

export const AddGroupButton: FC = () => {
  const { showErrorMessage } = useShowToast();
  const { groupsLength, groupTitleDir, groupSubTitleDir, addGroups } =
    useShallowMainStore((state) => ({
      groupsLength: state.groups.length,
      groupTitleDir: state.configs.groups.title.dir,
      groupSubTitleDir: state.configs.groups.subtitle.dir,
      addGroups: state.addGroups,
    }));

  const setSelected = useSetAtom(selectedAtom);

  const createGroup = () => {
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
  };

  return (
    <CommonButton
      config={{
        id: ToolConfigIDs.GROUP,
        tooltip: `Create group (groups: ${groupsLength})`,
        color: colorMap[Colors.YELLOW],
        icon: <FolderOutlined />,
        value: false,
        valueModifier: createGroup,
        badge: groupsLength > 0 ? groupsLength : null,
        enabled: true,
        shortcut: KeyboardShortcuts.GROUP,
      }}
    />
  );
};
