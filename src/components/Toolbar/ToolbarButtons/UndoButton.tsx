import { FC } from 'react';
import { useStore } from 'zustand';
import { UndoOutlined } from '@mui/icons-material';

import { colorMap, Colors, KeyboardShortcuts, ToolConfigIDs } from 'types';
import { useMainStore } from 'store';
import { UndoKeyboardListener } from 'CoverBoard/Keyboard';

import { CommonButton } from './CommonButton';

export const UndoButton: FC = () => {
  const { undo: undoAction, pastStates } = useStore(useMainStore.temporal);
  const actionsLength = pastStates.length;

  return (
    <>
      {actionsLength > 0 && <UndoKeyboardListener />}
      <CommonButton
        config={{
          id: ToolConfigIDs.UNDO,
          tooltip: `Undo (moves: ${actionsLength}/10)`,
          color: colorMap[Colors.PINK],
          icon: <UndoOutlined />,
          value: actionsLength < 1,
          valueModifier: () => undoAction(),
          badge: actionsLength > 0 ? actionsLength : null,
          enabled: true,
          shortcut: KeyboardShortcuts.UNDO,
        }}
      />
    </>
  );
};
