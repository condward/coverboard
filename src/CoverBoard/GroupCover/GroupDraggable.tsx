import { FC, ReactNode } from 'react';

import { GroupSchema } from 'types';
import { useMainStore } from 'store';
import { CommonDraggable } from 'CoverBoard/Common';
import { useGetMaxBoundaries } from 'utils';

export const GroupDraggable: FC<{
  group: GroupSchema;
  children: ReactNode[];
}> = ({ group, children }) => {
  const {
    id,
    pos: { x, y },
    scale: { x: scaleX, y: scaleY },
  } = group;

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
