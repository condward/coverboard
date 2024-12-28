import { FC, ReactNode } from 'react';

import { useShallowMainStore } from 'store';
import { CommonDraggable } from 'CoverBoard/Common';
import { useGetMaxBoundaries } from 'utils';

export const CoverDraggable: FC<{
  index: number;
  children: ReactNode[];
}> = ({ index, children }) => {
  const { x, y, id, updateCover, removeCoverAndRelatedArrows } =
    useShallowMainStore((state) => {
      const {
        pos: { x, y },
        id,
      } = state.getCoverByIdx(index);

      return {
        x,
        y,
        id,
        updateCover: state.updateCover,
        removeCoverAndRelatedArrows: state.removeCoverAndRelatedArrows,
      };
    });

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
