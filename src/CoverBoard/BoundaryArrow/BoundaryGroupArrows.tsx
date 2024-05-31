import { FC } from 'react';

import { useMainStore } from 'store';

import { BoundaryArrow } from './BoundaryArrow';

export const BoundaryGroupArrows: FC = () => {
  const offLimitGroups = useMainStore((state) => state.offLimitGroups());
  const updateGroupPosition = useMainStore(
    (state) => state.updateGroupPosition,
  );
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );
  const groupColor = useMainStore((state) => state.getGroupColor());

  return (
    <>
      {offLimitGroups.map((group) => (
        <BoundaryArrow
          color={groupColor}
          updatePosition={updateGroupPosition}
          removeCascade={removeGroupAndRelatedLines}
          id={group.id}
          x={group.x}
          y={group.y}
          scaleX={group.scaleX}
          scaleY={group.scaleY}
          title={group.title.text}
          key={group.id}
        />
      ))}
    </>
  );
};
