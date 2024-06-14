import { FC } from 'react';

import { useMainStore } from 'store';
import { useGetSizesContext } from 'providers';

import { BoundaryArrow } from './BoundaryArrow';

export const BoundaryGroupArrows: FC = () => {
  const { canvasLimits } = useGetSizesContext();
  const groups = useMainStore((state) => state.groups);
  const scale = useMainStore((state) => state.configs.layout.scale);

  const offLimitGroups = groups.flatMap((group) => {
    if (
      (group.pos.x > canvasLimits.width && canvasLimits.width > scale) ||
      (group.pos.y > canvasLimits.height && canvasLimits.height > scale)
    ) {
      return group;
    }

    return [];
  });
  const updateGroup = useMainStore((state) => state.updateGroup);
  const removeGroupAndRelatedArrows = useMainStore(
    (state) => state.removeGroupAndRelatedArrows,
  );
  const groupColor = useMainStore((state) => state.getGroupColor());

  return (
    <>
      {offLimitGroups.map((group) => (
        <BoundaryArrow
          color={groupColor}
          updatePosition={(pos) => updateGroup(group.id, { pos })}
          removeCascade={removeGroupAndRelatedArrows}
          x={group.pos.x}
          y={group.pos.y}
          scaleX={group.scale.x}
          scaleY={group.scale.y}
          title={group.title.text}
          key={group.id}
        />
      ))}
    </>
  );
};
