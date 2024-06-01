import { FC, memo } from 'react';

import { useMainStore } from 'store';
import { useGetSizesContext } from 'providers';

import { BoundaryArrow } from './BoundaryArrow';

export const BoundaryCoverArrowsWithoutMemo: FC = () => {
  const { dragLimits } = useGetSizesContext();
  const covers = useMainStore((state) => state.covers);
  const size = useMainStore((state) => state.configs.size);

  const offLimitCovers = covers.flatMap((covers) => {
    if (
      (covers.x > dragLimits.width && dragLimits.width > size) ||
      (covers.y > dragLimits.height && dragLimits.height > size)
    ) {
      return covers;
    }

    return [];
  });

  const updateCoverPosition = useMainStore(
    (state) => state.updateCoverPosition,
  );
  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const coverColor = useMainStore((state) => state.getCoverColor());

  return (
    <>
      {offLimitCovers.map((cover) => (
        <BoundaryArrow
          color={coverColor}
          updatePosition={updateCoverPosition}
          removeCascade={removeCoverAndRelatedLines}
          id={cover.id}
          x={cover.x}
          y={cover.y}
          title={cover.subtitle.text}
          key={cover.id}
        />
      ))}
    </>
  );
};

export const BoundaryCoverArrows = memo(BoundaryCoverArrowsWithoutMemo);
