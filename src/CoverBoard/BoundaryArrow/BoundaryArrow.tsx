import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { FC, useState } from 'react';
import { Arrow, Group } from 'react-konva';

import { CoverSchema, GroupSchema } from 'types';
import { Tooltip } from 'components';
import { useGetSizesContext } from 'providers';

interface BoundaryArrowProps {
  title: CoverSchema['title']['text'] | GroupSchema['title']['text'];
  x: CoverSchema['pos']['x'] | GroupSchema['pos']['x'];
  y: CoverSchema['pos']['y'] | GroupSchema['pos']['y'];
  scaleX?: GroupSchema['scale']['x'];
  scaleY?: GroupSchema['scale']['y'];
  updatePosition: ({ x, y }: Vector2d) => void;
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
  const { coverSizeWidth, coverSizeHeight, fontSize, canvasLimits } =
    useGetSizesContext();

  if (
    x > canvasLimits.width - coverSizeWidth * scaleX &&
    y > canvasLimits.height - coverSizeHeight * scaleY
  ) {
    return [
      canvasLimits.width - 1.8 * fontSize,
      canvasLimits.height - 1.8 * fontSize,
      canvasLimits.width - fontSize,
      canvasLimits.height - fontSize,
    ];
  } else if (
    x > canvasLimits.width - coverSizeWidth * scaleX &&
    y < canvasLimits.height - coverSizeHeight * scaleY
  ) {
    return [
      canvasLimits.width - 2 * fontSize,
      y + (coverSizeHeight * scaleY) / 2,
      canvasLimits.width - fontSize,
      y + (coverSizeHeight * scaleY) / 2,
    ];
  }
  return [
    x + (coverSizeWidth * scaleX) / 2,
    canvasLimits.height - 2 * fontSize,
    x + (coverSizeWidth * scaleX) / 2,
    canvasLimits.height - fontSize,
  ];
};

export const BoundaryArrow: FC<BoundaryArrowProps> = ({
  title,
  x,
  y,
  scaleX = 1,
  scaleY = 1,
  updatePosition,
  color,
}) => {
  const { coverSizeWidth, coverSizeHeight, fontSize, canvasLimits } =
    useGetSizesContext();

  const [tooltip, setTooltip] = useState(false);
  const points = useGetPoints({ x, y, scaleX, scaleY });

  const handleBringIntoView = () => {
    const newPos: Vector2d = { x, y };
    if (newPos.x > canvasLimits.width) {
      newPos.x = canvasLimits.width - coverSizeWidth * scaleX;
    }
    if (newPos.y > canvasLimits.height) {
      newPos.y = canvasLimits.height - coverSizeHeight * scaleY;
    }

    updatePosition(newPos);
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
