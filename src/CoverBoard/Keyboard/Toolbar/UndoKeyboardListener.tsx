import { FC, useEffect } from 'react';
import { useStore } from 'zustand';

import { useMainStore } from 'store';
import { usePreventKeys } from 'utils';

export const UndoKeyboardListener: FC = () => {
  const { undo: undoAction } = useStore(useMainStore.temporal);
  const preventKeys = usePreventKeys();

  useEffect(() => {
    if (preventKeys) return;

    const keyFn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undoAction();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', keyFn);

    return () => window.removeEventListener('keydown', keyFn);
  }, [undoAction, preventKeys]);

  return null;
};
