import { FC, useEffect } from 'react';
import { useSetAtom } from 'jotai';

import { KeyboardShortcuts } from 'types';
import {
  pointsAtom,
  selectedAtom,
  useGetPointDirection,
  useShallowMainStore,
} from 'store';

export const CoverPointUnselected: FC<{
  index: number;
}> = ({ index }) => {
  const { id, updateCover, removeCoverAndRelatedArrows, getCovers } =
    useShallowMainStore((state) => {
      return {
        id: state.getCoverByIdx(index).id,
        updateCover: state.updateCover,
        removeCoverAndRelatedArrows: state.removeCoverAndRelatedArrows,
        getCovers: state.getCovers,
      };
    });

  const pointDirection = useGetPointDirection(id);
  const setSelected = useSetAtom(selectedAtom);
  const setPoints = useSetAtom(pointsAtom);

  useEffect(() => {
    const keyFn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPoints(null);
        e.preventDefault();
      } else if (
        e.key === 'Delete' ||
        (e.key as KeyboardShortcuts) === KeyboardShortcuts.DELETE
      ) {
        removeCoverAndRelatedArrows(id);
        e.preventDefault();
      } else if ((e.key as KeyboardShortcuts) === KeyboardShortcuts.NEXT) {
        const covers = getCovers();
        if (index > -1 && Boolean(covers[index - 1])) {
          setSelected({
            id: covers[index - 1].id,
            open: false,
          });
          e.preventDefault();
        } else {
          setSelected({
            id: covers[covers.length - 1].id,
            open: false,
          });
          e.preventDefault();
        }
      } else if ((e.key as KeyboardShortcuts) === KeyboardShortcuts.PREV) {
        const covers = getCovers();
        if (index > -1 && Boolean(covers[index + 1])) {
          setSelected({
            id: covers[index + 1].id,
            open: false,
          });
          e.preventDefault();
        } else {
          setSelected({ id: covers[0].id, open: false });
          e.preventDefault();
        }
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [
    getCovers,
    id,
    index,
    removeCoverAndRelatedArrows,
    pointDirection,
    setPoints,
    setSelected,
    updateCover,
  ]);

  return null;
};
