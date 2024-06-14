import { FC, memo } from 'react';

import { useMainStore } from 'store';
import { useGetSizesContext } from 'providers';

import { BoundaryArrow } from './BoundaryArrow';

export const BoundaryCoverArrowsWithoutMemo: FC = () => {
  const { canvasLimits } = useGetSizesContext();
  const covers = useMainStore((state) => state.covers);
  const scale = useMainStore((state) => state.configs.layout.scale);

  const offLimitCovers = covers.flatMap((covers) => {
    if (
      (covers.pos.x > canvasLimits.width && canvasLimits.width > scale) ||
      (covers.pos.y > canvasLimits.height && canvasLimits.height > scale)
    ) {
      return covers;
    }

    return [];
  });

  const updateGroup = useMainStore((state) => state.updateGroup);
  const removeCoverAndRelatedArrows = useMainStore(
    (state) => state.removeCoverAndRelatedArrows,
  );
  const coverColor = useMainStore((state) => state.getCoverColor());

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

export const BoundaryCoverArrows = memo(BoundaryCoverArrowsWithoutMemo);
