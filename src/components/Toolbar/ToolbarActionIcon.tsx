import { UndoOutlined } from '@mui/icons-material';
import { useStore } from 'zustand';
import { FC } from 'react';

import { ToolbarIcon } from 'components';
import { useMainStore } from 'store';
import {
  ToolConfig,
  ToolConfigIDs,
  colorMap,
  Colors,
  KeyboardShortcuts,
} from 'types';

import { UndoKeyboardListener } from 'CoverBoard/Keyboard';

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
    shortcut: KeyboardShortcuts.UNDO,
  };

  return (
    <>
      {actionsLength > 0 && <UndoKeyboardListener />}
      <ToolbarIcon config={actionConfig} index={6} />
    </>
  );
};
