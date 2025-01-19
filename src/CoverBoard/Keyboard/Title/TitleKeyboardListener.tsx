import { FC, useEffect } from 'react';
import { useSetAtom } from 'jotai';

import { KeyboardShortcuts } from 'types';
import { editTitleAtom } from 'store';
import { usePreventKeys } from 'utils';

export const TitleKeyboardListener: FC = () => {
  const preventKeys = usePreventKeys();
  const setEditTitle = useSetAtom(editTitleAtom);

  useEffect(() => {
    if (preventKeys) return;

    const keyFn = (e: KeyboardEvent) => {
      if (e.key === KeyboardShortcuts.TITLE.toLowerCase()) {
        setEditTitle(true);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', keyFn);

    return () => window.removeEventListener('keydown', keyFn);
  }, [setEditTitle, preventKeys]);

  return null;
};
