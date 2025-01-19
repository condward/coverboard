import { FC, useEffect } from 'react';
import { useSetAtom } from 'jotai';

import { KeyboardShortcuts } from 'types';
import {
  pointsAtom,
  selectedAtom,
  usePoints,
  useShallowMainStore,
} from 'store';

import { CoverPointSelectedKeyboardListener } from './CoverPointSelectedKeyboardListener';

export const CoverSelectedKeyboardListener: FC<{
  index: number;
}> = ({ index }) => {
  const { id, removeCoverAndRelatedArrows, getCovers } = useShallowMainStore(
    (state) => {
      return {
        id: state.getCoverByIdx(index).id,
        removeCoverAndRelatedArrows: state.removeCoverAndRelatedArrows,
        getCovers: state.getCovers,
      };
    },
  );

  const { pointDirection } = usePoints(id);
  const setSelected = useSetAtom(selectedAtom);
  const setPoints = useSetAtom(pointsAtom);

  useEffect(() => {
    const keyFn = (e: KeyboardEvent) => {
      const key = e.key as KeyboardShortcuts;

      if (e.key === 'Escape') {
        setSelected(null);
        setPoints(null);
        e.preventDefault();
      } else if (e.key === 'Delete' || key === KeyboardShortcuts.DELETE) {
        removeCoverAndRelatedArrows(id);
        e.preventDefault();
      } else if (
        key === KeyboardShortcuts.NEXT ||
        key === KeyboardShortcuts.PREV
      ) {
        const covers = getCovers();
        setSelected({
          id: covers[
            (index +
              (key === KeyboardShortcuts.NEXT ? -1 : 1) +
              covers.length) %
              covers.length
          ].id,
          open: false,
        });
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [
    getCovers,
    id,
    index,
    removeCoverAndRelatedArrows,
    setPoints,
    setSelected,
  ]);

  return pointDirection ? (
    <CoverPointSelectedKeyboardListener
      index={index}
      pointDirection={pointDirection}
    />
  ) : null;
};
