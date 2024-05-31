import { FC, memo } from 'react';

import { useMainStore } from 'store';

import { BoundaryArrow } from './BoundaryArrow';

export const BoundaryCoverArrowsWithoutMemo: FC = () => {
  const offLimitCovers = useMainStore((state) => state.offLimitCovers());
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
