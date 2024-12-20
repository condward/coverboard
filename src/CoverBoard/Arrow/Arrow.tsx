import { FC } from 'react';
import { Group } from 'react-konva';

import { ArrowParams, ArrowSchema, PosTypes } from 'types';
import { useMainStore } from 'store';
import { useGetSizesContext } from 'providers';

import { ArrowLabel, ArrowPointer } from '.';

interface ArrowProps {
  id: ArrowSchema['id'];
  text: ArrowSchema['title']['text'];
  dir: ArrowSchema['title']['dir'];
  originId: ArrowSchema['origin']['id'];
  originDir: ArrowSchema['origin']['dir'];
  targetId: ArrowSchema['target']['id'];
  targetDir: ArrowSchema['target']['dir'];
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

interface UseGetArrowParams {
  originId: ArrowProps['originId'];
  originDir: ArrowProps['originDir'];
  targetId: ArrowProps['targetId'];
  targetDir: ArrowProps['targetDir'];
}

const useGetArrowParams = ({
  originId,
  originDir,
  targetId,
  targetDir,
}: UseGetArrowParams): ArrowParams | undefined => {
  const { coverSizeWidth, coverSizeHeight } = useGetSizesContext();

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

  const origin = originSquareCover ? 'cover' : 'group';
  const target = targetSquareCover ? 'cover' : 'group';

  const originSquare = originSquareCover ?? originSquareGroup;
  const targetSquare = targetSquareCover ?? targetSquareGroup;

  const scaleOriginX =
    originSquare && 'scale' in originSquare ? originSquare.scale.x : 1;
  const scaleOriginY =
    originSquare && 'scale' in originSquare ? originSquare.scale.y : 1;
  const scaleDestX =
    targetSquare && 'scale' in targetSquare ? targetSquare.scale.x : 1;
  const scaleDestY =
    targetSquare && 'scale' in targetSquare ? targetSquare.scale.y : 1;

  const coverSizeOriginWidth = coverSizeWidth * scaleOriginX;
  const coverSizeOriginHeight = coverSizeHeight * scaleOriginY;
  const coverSizeDistWidth = coverSizeWidth * scaleDestX;
  const coverSizeDistHeight = coverSizeHeight * scaleDestY;

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
      originSquare.pos.x + originPos.x,
      originSquare.pos.y + originPos.y,
      targetSquare.pos.x + targetPos.x,
      targetSquare.pos.y + targetPos.y,
    ];

    const midX = (points[0] + points[2]) / 2;
    const midY = (points[1] + points[3]) / 2;

    return {
      midX,
      midY,
      points,
    };
  }
};

export const Arrow: FC<ArrowProps> = ({
  id,
  dir,
  originId,
  originDir,
  targetId,
  targetDir,
  text,
}) => {
  const ArrowParams = useGetArrowParams({
    originId,
    originDir,
    targetId,
    targetDir,
  });

  if (!ArrowParams) return null;

  return (
    <Group>
      <ArrowPointer ArrowParams={ArrowParams} />
      <Group x={ArrowParams.midX} y={ArrowParams.midY}>
        <ArrowLabel id={id} dir={dir} ArrowParams={ArrowParams} text={text} />
      </Group>
    </Group>
  );
};
