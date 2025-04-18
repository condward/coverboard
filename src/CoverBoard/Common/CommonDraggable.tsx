import { Group, Arrow } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { useState, ReactNode, FC } from 'react';

import { CoverSchema, GroupSchema } from 'types';
import { useShallowMainStore } from 'store';
import { useGetSizesContext } from 'providers';

interface CommonDraggableProps {
  children: ReactNode;
  id: CoverSchema['id'] | GroupSchema['id'];
  x: CoverSchema['pos']['x'] | GroupSchema['pos']['x'];
  y: CoverSchema['pos']['y'] | GroupSchema['pos']['y'];
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
  max,
  children,
  updatePosition,
}) => {
  const { canvasLimits } = useGetSizesContext();

  const { getCovers, getGroups, color, refreshGroups, refreshCovers } =
    useShallowMainStore((state) => ({
      getCovers: state.getCovers,
      getGroups: state.getGroups,
      color: state.getColor(),
      refreshGroups: state.refreshGroups,
      refreshCovers: state.refreshCovers,
    }));

  const [hintArrows, setHintArrows] = useState<
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
    const newX = Math.max(0, maxX);
    const newY = Math.max(0, maxY);

    return {
      x: newX,
      y: newY,
    };
  };

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    e.currentTarget.opacity(0.5);
    const covers = getCovers();
    const groups = getGroups();

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
    const covers = getCovers();
    const groups = getGroups();

    const foundY =
      covers.find((cover) => cover.id !== id && cover.pos.y === targetY) ??
      groups.find((group) => group.id !== id && group.pos.y === targetY);
    const foundX =
      covers.find((cover) => cover.id !== id && cover.pos.x === targetX) ??
      groups.find((group) => group.id !== id && group.pos.x === targetX);

    if (
      (hintArrows[0] === undefined && foundY) ||
      (hintArrows[1] === undefined && foundX)
    ) {
      setHintArrows([foundY, foundX]);
    } else if (
      (hintArrows[0] !== undefined && !foundY) ||
      (hintArrows[1] !== undefined && !foundX)
    ) {
      setHintArrows([undefined, undefined]);
    }
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    setHintArrows([undefined, undefined]);
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
      {hintArrows[0] && (
        <Arrow
          points={[
            0,
            hintArrows[0].pos.y,
            canvasLimits.width,
            hintArrows[0].pos.y,
          ]}
          stroke={color}
          strokeWidth={2}
        />
      )}
      {hintArrows[1] && (
        <Arrow
          points={[
            hintArrows[1].pos.x,
            0,
            hintArrows[1].pos.x,
            canvasLimits.height,
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
