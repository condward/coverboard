import { FC, useEffect } from 'react';

import { KeyboardShortcuts } from 'types';
import { usePreventKeys } from 'utils';

interface ToobarKeyboardListenerProps {
  shortcut: KeyboardShortcuts;
  onKeyPress: () => void;
}

export const ToobarKeyboardListener: FC<ToobarKeyboardListenerProps> = ({
  shortcut,
  onKeyPress,
}) => {
  const preventKeys = usePreventKeys();

  useEffect(() => {
    if (preventKeys) return;

    const keyFn = (e: KeyboardEvent) => {
      if ((e.key as KeyboardShortcuts) === shortcut) {
        onKeyPress();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', keyFn);

    return () => window.removeEventListener('keydown', keyFn);
  }, [shortcut, onKeyPress, preventKeys]);

  return null;
};
