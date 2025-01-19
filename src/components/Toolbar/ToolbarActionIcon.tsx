import { UndoOutlined } from '@mui/icons-material';
import { useStore } from 'zustand';
import { FC, useEffect } from 'react';

import { ToolbarIcon } from 'components';
import { useMainStore } from 'store';
import {
  ToolConfig,
  ToolConfigIDs,
  colorMap,
  Colors,
  KeyboardShortcuts,
} from 'types';
import { usePreventKeys } from 'utils';

export const ToolbarActionIcon: FC = () => {
  const { undo: undoAction, pastStates } = useStore(useMainStore.temporal);
  const actionsLength = pastStates.length;
  const preventKeys = usePreventKeys();

  useEffect(() => {
    if (preventKeys && actionsLength < 1) return;

    const keyFn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undoAction();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', keyFn);

    return () => window.removeEventListener('keydown', keyFn);
  }, [actionsLength, preventKeys, undoAction]);

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

  return <ToolbarIcon config={actionConfig} index={6} />;
};
