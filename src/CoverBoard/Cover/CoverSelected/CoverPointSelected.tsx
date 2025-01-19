import { FC, useEffect } from 'react';

import { useShallowMainStore } from 'store';
import { PosTypes } from 'types';

interface CoverPointSelected {
  index: number;
  pointDirection: PosTypes;
}

export const CoverPointSelected: FC<CoverPointSelected> = ({
  index,
  pointDirection,
}) => {
  const { id, updateCover, getCovers } = useShallowMainStore((state) => {
    return {
      id: state.getCoverByIdx(index).id,
      updateCover: state.updateCover,
      removeCoverAndRelatedArrows: state.removeCoverAndRelatedArrows,
      getCovers: state.getCovers,
    };
  });

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
          if (e.key === 'ArrowRight' && pointDirection === PosTypes.RIGHT) {
            updateCover(cover.id, { pos: { x: cover.pos.x + 1 } });
            e.preventDefault();
          } else if (
            e.key === 'ArrowLeft' &&
            pointDirection === PosTypes.LEFT
          ) {
            updateCover(cover.id, { pos: { x: cover.pos.x - 1 } });
            e.preventDefault();
          } else if (e.key === 'ArrowUp' && pointDirection === PosTypes.TOP) {
            updateCover(cover.id, { pos: { y: cover.pos.y - 1 } });
            e.preventDefault();
          } else if (
            e.key === 'ArrowDown' &&
            pointDirection === PosTypes.BOTTOM
          ) {
            updateCover(cover.id, { pos: { y: cover.pos.y + 1 } });
            e.preventDefault();
          }
        }
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [getCovers, id, pointDirection, updateCover]);

  return null;
};
