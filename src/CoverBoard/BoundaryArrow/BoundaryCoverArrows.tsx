import { FC } from 'react';

import { useShallowMainStore } from 'store';
import { useGetSizesContext } from 'providers';

import { BoundaryArrow } from './BoundaryArrow';

export const BoundaryCoverArrows: FC = () => {
  const { canvasLimits } = useGetSizesContext();

  const {
    covers,
    scale,
    updateGroup,
    removeCoverAndRelatedArrows,
    coverColor,
  } = useShallowMainStore((state) => ({
    covers: state.covers,
    scale: state.configs.layout.scale,
    updateGroup: state.updateGroup,
    removeCoverAndRelatedArrows: state.removeCoverAndRelatedArrows,
    coverColor: state.getCoverColor(),
  }));

  const offLimitCovers = covers.flatMap((covers) => {
    if (
      (covers.pos.x > canvasLimits.width && canvasLimits.width > scale) ||
      (covers.pos.y > canvasLimits.height && canvasLimits.height > scale)
    ) {
      return covers;
    }

    return [];
  });

  return (
    <>
      {offLimitCovers.map((cover) => (
        <BoundaryArrow
          color={coverColor}
          updatePosition={(pos) => updateGroup(cover.id, { pos })}
          removeCascade={removeCoverAndRelatedArrows}
          x={cover.pos.x}
          y={cover.pos.y}
          title={cover.subtitle.text}
          key={cover.id}
        />
      ))}
    </>
  );
};
