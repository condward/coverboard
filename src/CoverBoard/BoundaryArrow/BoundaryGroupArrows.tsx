import { FC } from 'react';

import { useMainStore } from 'store';
import { useGetSizesContext } from 'providers';

import { BoundaryArrow } from './BoundaryArrow';

export const BoundaryGroupArrows: FC = () => {
  const { dragLimits } = useGetSizesContext();
  const groups = useMainStore((state) => state.groups);
  const size = useMainStore((state) => state.configs.size);

  const offLimitGroups = groups.flatMap((group) => {
    if (
      (group.x > dragLimits.width && dragLimits.width > size) ||
      (group.y > dragLimits.height && dragLimits.height > size)
    ) {
      return group;
    }

    return [];
  });
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
