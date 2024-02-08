import React, { useMemo } from 'react';
import { Group } from 'react-konva';

import { LineParams, Lines, PosTypes } from 'types';
import { LineArrow, LineLabel } from '.';
import { useMainStore } from 'store';

interface LineProps {
  id: Lines['id'];
  dir: Lines['dir'];
  originId: Lines['origin']['id'];
  originDir: Lines['origin']['dir'];
  targetId: Lines['target']['id'];
  targetDir: Lines['target']['dir'];
  text: Lines['text'];
}

const convertPosToXY = (
  coverSizeWidth: number,
  coverSizeHeight: number,
  pos: PosTypes,
  type: 'cover' | 'group',
) => {
  const connection = type === 'cover' ? 16 : 32;
  if (pos === PosTypes.TOP) {
    return {
      x: coverSizeWidth / 2,
      y: -coverSizeHeight / connection,
    };
  } else if (pos === PosTypes.BOTTOM) {
    return {
      x: coverSizeWidth / 2,
      y: coverSizeHeight + coverSizeHeight / connection,
    };
  } else if (pos === PosTypes.LEFT) {
    return {
      x: -coverSizeWidth / connection,
      y: coverSizeHeight / 2,
    };
  } else {
    return {
      x: coverSizeWidth + coverSizeWidth / connection,
      y: coverSizeHeight / 2,
    };
  }
};

export const LineMemo: React.FC<LineProps> = ({
  id,
  dir,
  originId,
  originDir,
  targetId,
  targetDir,
  text,
}) => {
  const originSquareCover = useMainStore((state) =>
    state.covers.find((cov) => cov.id === originId),
  );
  const targetSquareCover = useMainStore((state) =>
    state.covers.find((cov) => cov.id === targetId),
  );

  const originSquareGroup = useMainStore((state) =>
    state.groups.find((cov) => cov.id === originId),
  );
  const targetSquareGroup = useMainStore((state) =>
    state.groups.find((cov) => cov.id === targetId),
  );
  const showArrow = useMainStore((state) => state.configs.showArrow);

  const origin = originSquareCover ? 'cover' : 'group';
  const target = targetSquareCover ? 'cover' : 'group';

  const originSquare = originSquareCover ?? originSquareGroup;
  const targetSquare = targetSquareCover ?? targetSquareGroup;

  const scaleOriginX =
    originSquare && 'scaleX' in originSquare ? originSquare.scaleX : 1;
  const scaleOriginY =
    originSquare && 'scaleY' in originSquare ? originSquare.scaleY : 1;
  const scaleDestX =
    targetSquare && 'scaleX' in targetSquare ? targetSquare.scaleX : 1;
  const scaleDestY =
    targetSquare && 'scaleY' in targetSquare ? targetSquare.scaleY : 1;

  const coverSizeOriginWidth = useMainStore(
    (state) => state.coverSizeWidth() * scaleOriginX,
  );
  const coverSizeOriginHeight = useMainStore(
    (state) => state.coverSizeHeight() * scaleOriginY,
  );
  const coverSizeDistWidth = useMainStore(
    (state) => state.coverSizeWidth() * scaleDestX,
  );
  const coverSizeDistHeight = useMainStore(
    (state) => state.coverSizeHeight() * scaleDestY,
  );

  const lineParams = useMemo((): LineParams | undefined => {
    if (originSquare && targetSquare) {
      const originPos = convertPosToXY(
        coverSizeOriginWidth,
        coverSizeOriginHeight,
        originDir,
        origin,
      );
      const targetPos = convertPosToXY(
        coverSizeDistWidth,
        coverSizeDistHeight,
        targetDir,
        target,
      );

      const points = [
        originSquare.x + originPos.x,
        originSquare.y + originPos.y,
        targetSquare.x + targetPos.x,
        targetSquare.y + targetPos.y,
      ];

      const midX = (points[0] + points[2]) / 2;
      const midY = (points[1] + points[3]) / 2;

      return {
        midX,
        midY,
        points,
      };
    }
  }, [
    originSquare,
    targetSquare,
    coverSizeOriginWidth,
    coverSizeOriginHeight,
    originDir,
    origin,
    coverSizeDistWidth,
    coverSizeDistHeight,
    targetDir,
    target,
  ]);

  if (!lineParams) return null;

  return (
    <Group>
      <LineArrow lineParams={lineParams} />
      {showArrow && (
        <Group x={lineParams.midX} y={lineParams.midY}>
          <LineLabel id={id} dir={dir} lineParams={lineParams} text={text} />
        </Group>
      )}
    </Group>
  );
};

export const Line = React.memo(LineMemo);
