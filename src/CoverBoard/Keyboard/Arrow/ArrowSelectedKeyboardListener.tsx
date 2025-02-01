import { FC, useEffect } from 'react';
import { useSetAtom } from 'jotai';

import { selectedAtom, useShallowMainStore } from 'store';
import { KeyboardShortcuts } from 'types';

export const ArrowSelectedKeyboardListener: FC<{ id: string }> = ({ id }) => {
  const { removeArrow } = useShallowMainStore((state) => ({
    removeArrow: state.removeArrow,
  }));

  const setSelected = useSetAtom(selectedAtom);

  useEffect(() => {
    const keyFn = (e: KeyboardEvent) => {
      if (
        e.key === 'Delete' ||
        (e.key as KeyboardShortcuts) === KeyboardShortcuts.DELETE
      ) {
        removeArrow(id);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setSelected(null);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', keyFn);

    return () => window.removeEventListener('keydown', keyFn);
  }, [removeArrow, id, setSelected]);

  return null;
};
