import { FC } from 'react';

import { useShallowMainStore } from 'store';
import { useGetSizesContext } from 'providers';

import { BoundaryArrow } from './BoundaryArrow';

export const BoundaryGroupArrows: FC = () => {
  const { canvasLimits } = useGetSizesContext();

  const {
    getGroups,
    scale,
    updateGroup,
    removeGroupAndRelatedArrows,
    groupColor,
  } = useShallowMainStore((state) => ({
    getGroups: state.getGroups,
    scale: state.configs.layout.scale,
    updateGroup: state.updateGroup,
    removeGroupAndRelatedArrows: state.removeGroupAndRelatedArrows,
    groupColor: state.getGroupColor(),
  }));
  const groups = getGroups();

  const offLimitGroups = groups.flatMap((group) => {
    if (
      (group.pos.x > canvasLimits.width && canvasLimits.width > scale) ||
      (group.pos.y > canvasLimits.height && canvasLimits.height > scale)
    ) {
      return group;
    }

    return [];
  });

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
