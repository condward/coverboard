import { FC, useEffect } from 'react';
import { useSetAtom } from 'jotai';

import { PosTypes } from 'types';

import { selectedAtom } from 'store';

export const CommonPointSelectedKeyboardListener: FC<{
  id: string;
  handleDrawArrow: (id: string, dir: PosTypes) => void;
}> = ({ id, handleDrawArrow }) => {
  const setSelected = useSetAtom(selectedAtom);

  useEffect(() => {
    const keyFn = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleDrawArrow(id, PosTypes.RIGHT);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        handleDrawArrow(id, PosTypes.LEFT);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        handleDrawArrow(id, PosTypes.TOP);
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        handleDrawArrow(id, PosTypes.BOTTOM);
        e.preventDefault();
      } else if (e.key === 'Enter') {
        setSelected({ id, open: true });
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [handleDrawArrow, id, setSelected]);

  return null;
};
