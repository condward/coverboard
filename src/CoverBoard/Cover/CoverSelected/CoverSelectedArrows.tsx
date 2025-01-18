import { FC, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';

import { KeyboardShortcuts, PosTypes } from 'types';
import { pointsAtom, selectedAtom, useShallowMainStore } from 'store';
import { CommonSelectedArrows } from 'CoverBoard/Common';

export const CoverSelectedArrows: FC<{
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

  const [points, setPoints] = useAtom(pointsAtom);
  const selection = points?.id === id ? points.dir : null;
  const setSelected = useSetAtom(selectedAtom);

  useEffect(() => {
    const keyFn = (e: KeyboardEvent) => {
      if (
        e.key === 'ArrowRight' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown'
      ) {
        const cover = getCovers().find((cover) => id === cover.id);

        if (cover) {
          if (e.key === 'ArrowRight' && selection === PosTypes.RIGHT) {
            updateCover(cover.id, { pos: { x: cover.pos.x + 1 } });
            e.preventDefault();
          } else if (e.key === 'ArrowLeft' && selection === PosTypes.LEFT) {
            updateCover(cover.id, { pos: { x: cover.pos.x - 1 } });
            e.preventDefault();
          } else if (e.key === 'ArrowUp' && selection === PosTypes.TOP) {
            updateCover(cover.id, { pos: { y: cover.pos.y - 1 } });
            e.preventDefault();
          } else if (e.key === 'ArrowDown' && selection === PosTypes.BOTTOM) {
            updateCover(cover.id, { pos: { y: cover.pos.y + 1 } });
            e.preventDefault();
          }
        }
      } else if (e.key === 'Escape') {
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
    selection,
    setPoints,
    setSelected,
    updateCover,
  ]);

  return <CommonSelectedArrows id={id} />;
};
