import { FC, ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useMainStore } from 'store';
import { CommonDraggable } from 'CoverBoard/Common';
import { useGetMaxBoundaries } from 'utils';

export const CoverDraggable: FC<{
  index: number;
  children: ReactNode[];
}> = ({ index, children }) => {
  const { x, y, id } = useMainStore(
    useShallow((state) => {
      const {
        pos: { x, y },
        id,
      } = state.getCoverByIdx(index);

      return { x, y, id };
    }),
  );

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
