import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { FC, memo, useState } from 'react';
import { Arrow, Group } from 'react-konva';

import { CoverSchema, GroupSchema } from 'types';
import { Tooltip } from 'components';
import { useGetSizesContext } from 'providers';

interface BoundaryArrowProps {
  id: CoverSchema['id'] | GroupSchema['id'];
  title: CoverSchema['title']['text'] | GroupSchema['title']['text'];
  x: CoverSchema['x'] | GroupSchema['x'];
  y: CoverSchema['y'] | GroupSchema['y'];
  scaleX?: GroupSchema['x'];
  scaleY?: GroupSchema['y'];
  updatePosition: (coverId: string, { x, y }: Vector2d) => void;
  removeCascade: (id: string) => void;
  color: string;
}

interface UseGetPoints {
  x: BoundaryArrowProps['x'];
  y: BoundaryArrowProps['y'];
  scaleX: NonNullable<BoundaryArrowProps['scaleX']>;
  scaleY: NonNullable<BoundaryArrowProps['scaleY']>;
}

const useGetPoints = ({
  x,
  y,
  scaleX,
  scaleY,
}: UseGetPoints): [number, number, number, number] => {
  const { coverSizeWidth, coverSizeHeight, fontSize, dragLimits } =
    useGetSizesContext();

  if (
    x > dragLimits.width - coverSizeWidth * scaleX &&
    y > dragLimits.height - coverSizeHeight * scaleY
  ) {
    return [
      dragLimits.width - 1.8 * fontSize,
      dragLimits.height - 1.8 * fontSize,
      dragLimits.width - fontSize,
      dragLimits.height - fontSize,
    ];
  } else if (
    x > dragLimits.width - coverSizeWidth * scaleX &&
    y < dragLimits.height - coverSizeHeight * scaleY
  ) {
    return [
      dragLimits.width - 2 * fontSize,
      y + (coverSizeHeight * scaleY) / 2,
      dragLimits.width - fontSize,
      y + (coverSizeHeight * scaleY) / 2,
    ];
  }
  return [
    x + (coverSizeWidth * scaleX) / 2,
    dragLimits.height - 2 * fontSize,
    x + (coverSizeWidth * scaleX) / 2,
    dragLimits.height - fontSize,
  ];
};

const BoundaryArrowWithoutMemo: FC<BoundaryArrowProps> = ({
  id,
  title,
  x,
  y,
  scaleX = 1,
  scaleY = 1,
  updatePosition,
  color,
}) => {
  const { coverSizeWidth, coverSizeHeight, fontSize, dragLimits } =
    useGetSizesContext();

  const [tooltip, setTooltip] = useState(false);
  const points = useGetPoints({ x, y, scaleX, scaleY });

  const handleBringIntoView = () => {
    const newPos: Vector2d = { x, y };
    if (newPos.x > dragLimits.width) {
      newPos.x = dragLimits.width - coverSizeWidth * scaleX;
    }
    if (newPos.y > dragLimits.height) {
      newPos.y = dragLimits.height - coverSizeHeight * scaleY;
    }

    updatePosition(id, newPos);
  };

  return (
    <Group>
      <Arrow
        points={points}
        stroke={color}
        strokeWidth={fontSize / 2}
        pointerLength={fontSize}
        onClick={handleBringIntoView}
        onTap={handleBringIntoView}
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();
          setTooltip(true);
          if (container) {
            container.style.cursor = 'pointer';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();
          setTooltip(false);
          if (container) {
            container.style.cursor = 'default';
          }
        }}
      />
      {tooltip && (
        <Tooltip
          text={title}
          x={points[0] - 2 * coverSizeWidth * scaleX - fontSize}
          y={points[1] - fontSize}
          align="right"
        />
      )}
    </Group>
  );
};

export const BoundaryArrow = memo(BoundaryArrowWithoutMemo);
