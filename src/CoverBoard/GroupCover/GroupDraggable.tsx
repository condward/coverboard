import { FC, ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useMainStore } from 'store';
import { CommonDraggable } from 'CoverBoard/Common';
import { useGetMaxBoundaries } from 'utils';

export const GroupDraggable: FC<{
  index: number;
  children: ReactNode[];
}> = ({ index, children }) => {
  const { id, x, y, scaleX, scaleY } = useMainStore(
    useShallow((state) => {
      const {
        id,
        pos: { x, y },
        scale: { x: scaleX, y: scaleY },
      } = state.getGroupByIdx(index);

      return {
        id,
        x,
        y,
        scaleX,
        scaleY,
      };
    }),
  );

  const updateGroup = useMainStore((state) => state.updateGroup);

  const removeGroupAndRelatedArrows = useMainStore(
    (state) => state.removeGroupAndRelatedArrows,
  );

  const { getMaxBoundaries } = useGetMaxBoundaries();

  return (
    <CommonDraggable
      updatePosition={(pos) => updateGroup(id, { pos })}
      onDelete={removeGroupAndRelatedArrows}
      id={id}
      x={x}
      y={y}
      max={getMaxBoundaries({ x: scaleX, y: scaleY })}>
      {children}
    </CommonDraggable>
  );
};
