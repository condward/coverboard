import { Group, Line } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { useState, ReactNode, FC } from 'react';

import { CoverSchema, GroupSchema } from 'types';
import { useMainStore } from 'store';
import { useGetSizesContext } from 'providers';

interface CommonDraggableProps {
  children: ReactNode;
  id: CoverSchema['id'] | GroupSchema['id'];
  x: CoverSchema['pos']['x'] | GroupSchema['pos']['x'];
  y: CoverSchema['pos']['y'] | GroupSchema['pos']['y'];
  min: {
    x: number;
    y: number;
  };
  max: {
    x: number;
    y: number;
  };
  updatePosition: ({ x, y }: Vector2d) => void;
  onDelete?: (id: string) => void;
}

export const CommonDraggable: FC<CommonDraggableProps> = ({
  id,
  x,
  y,
  min,
  max,
  children,
  updatePosition,
}) => {
  const covers = useMainStore((state) => state.covers);
  const groups = useMainStore((state) => state.groups);
  const color = useMainStore((state) => state.getColor());

  const { dragLimits } = useGetSizesContext();
  const [hintLines, setHintLines] = useState<
    [
      CoverSchema | GroupSchema | undefined,
      CoverSchema | GroupSchema | undefined,
    ]
  >([undefined, undefined]);

  const handleDragBound = (pos: Vector2d) => {
    // Max limit, pos or min
    const maxX = Math.min(pos.x, max.x);
    const maxY = Math.min(pos.y, max.y);

    // Lower limit, pos or min
    const newX = Math.max(min.x, maxX);
    const newY = Math.max(min.y, maxY);

    return {
      x: newX,
      y: newY,
    };
  };

  const refreshGroups = useMainStore((state) => state.refreshGroups);
  const refreshCovers = useMainStore((state) => state.refreshCovers);

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    e.currentTarget.opacity(0.5);

    if (covers.some((cov) => cov.id === id)) {
      refreshCovers(id);
    } else if (groups.some((group) => group.id === id)) {
      refreshGroups(id);
    }

    const container = e.target.getStage()?.container();

    if (container) {
      container.style.cursor = 'grab';
    }
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    const targetY = Math.round(e.target.y());
    const targetX = Math.round(e.target.x());

    const foundY =
      covers.find((cover) => cover.id !== id && cover.pos.y === targetY) ||
      groups.find((group) => group.id !== id && group.pos.y === targetY);
    const foundX =
      covers.find((cover) => cover.id !== id && cover.pos.x === targetX) ||
      groups.find((group) => group.id !== id && group.pos.x === targetX);

    if (
      (hintLines[0] === undefined && foundY) ||
      (hintLines[1] === undefined && foundX)
    ) {
      setHintLines([foundY, foundX]);
    } else if (
      (hintLines[0] !== undefined && !foundY) ||
      (hintLines[1] !== undefined && !foundX)
    ) {
      setHintLines([undefined, undefined]);
    }
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    setHintLines([undefined, undefined]);
    e.currentTarget.opacity(1);
    const container = e.target.getStage()?.container();

    if (container) {
      container.style.cursor = 'pointer';
    }

    updatePosition({
      x: Math.round(e.target.x()),
      y: Math.round(e.target.y()),
    });
  };

  return (
    <>
      {hintLines[0] && (
        <Line
          points={[0, hintLines[0].pos.y, dragLimits.width, hintLines[0].pos.y]}
          stroke={color}
          strokeWidth={2}
        />
      )}
      {hintLines[1] && (
        <Line
          points={[
            hintLines[1].pos.x,
            0,
            hintLines[1].pos.x,
            dragLimits.height,
          ]}
          stroke={color}
          strokeWidth={1}
        />
      )}
      <Group
        x={x}
        y={y}
        draggable
        onDragMove={handleDragMove}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        dragBoundFunc={handleDragBound}
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();
          if (container) {
            container.style.cursor = 'grab';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();
          if (container) {
            container.style.cursor = 'default';
          }
        }}>
        {children}
      </Group>
    </>
  );
};
