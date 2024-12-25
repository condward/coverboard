import { FC, ReactNode } from 'react';

import { useMainStore } from 'store';
import { CommonDraggable } from 'CoverBoard/Common';
import { CoverSchema } from 'types';
import { useGetMaxBoundaries } from 'utils';

export const CoverDraggable: FC<{
  cover: CoverSchema;
  children: ReactNode[];
}> = ({ cover, children }) => {
  const {
    id,
    pos: { x, y },
  } = cover;

  const updateCover = useMainStore((state) => state.updateCover);

  const removeCoverAndRelatedArrows = useMainStore(
    (state) => state.removeCoverAndRelatedArrows,
  );

  const { getMaxBoundaries } = useGetMaxBoundaries();

  return (
    <CommonDraggable
      updatePosition={(pos) => updateCover(id, { pos })}
      onDelete={removeCoverAndRelatedArrows}
      id={id}
      x={x}
      y={y}
      max={getMaxBoundaries()}>
      {children}
    </CommonDraggable>
  );
};
