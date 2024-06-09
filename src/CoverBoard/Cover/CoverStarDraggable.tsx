import { Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { CoverSchema, PosTypes } from 'types';
import { getClientPosition } from 'utils';
import { useMainStore } from 'store';
import { useGetSizesContext } from 'providers';

interface DraggableGroupProps {
  children: ReactNode;
  id: CoverSchema['id'];
  x: CoverSchema['pos']['x'];
  y: CoverSchema['pos']['y'];
  starDir: CoverSchema['star']['dir'];
}

const useGetNewPos = (starDir: DraggableGroupProps['starDir']) => {
  const { starRadius, coverSizeWidth, coverSizeHeight } = useGetSizesContext();
  const totalWidth = 4 * starRadius * 3;

  if (starDir === PosTypes.BOTTOM) {
    return {
      x: 0,
      y: starRadius * 2,
    };
  } else if (starDir === PosTypes.TOP) {
    return {
      x: 0,
      y: -coverSizeHeight - 2 * starRadius,
    };
  } else if (starDir === PosTypes.RIGHT) {
    return {
      x: coverSizeWidth + starRadius * 2.5,
      y: -coverSizeHeight / 2 - starRadius,
    };
  } else {
    return {
      x: -totalWidth - starRadius * 3.5,
      y: -coverSizeHeight / 2 - starRadius,
    };
  }
};

const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
  e.cancelBubble = true;
  const container = e.target.getStage()?.container();

  if (container) {
    container.style.cursor = 'grab';
  }
};

export const CoverStarDraggable = ({
  id,
  x,
  y,
  starDir,
  children,
}: DraggableGroupProps) => {
  const updateCover = useMainStore((state) => state.updateCover);
  const { dragLimits, coverSizeHeight } = useGetSizesContext();
  const [randId, setId] = useState(uuidv4());

  const handleDragEnd = (e: KonvaEventObject<DragEvent | TouchEvent>) => {
    e.cancelBubble = true;
    const container = e.target.getStage()?.container();

    if (container) {
      container.style.cursor = 'grab';
    }

    const { x: xAbs, y: yAbs } = getClientPosition(e);

    let newDir: PosTypes;
    if (yAbs > dragLimits.y + y + coverSizeHeight) {
      newDir = PosTypes.BOTTOM;
    } else if (yAbs < y + dragLimits.y) {
      newDir = PosTypes.TOP;
    } else if (xAbs < x + dragLimits.x) {
      newDir = PosTypes.LEFT;
    } else {
      newDir = PosTypes.RIGHT;
    }

    setId(uuidv4());
    updateCover(id, { star: { dir: newDir } });
  };

  const newPos = useGetNewPos(starDir);

  return (
    <Group
      key={randId}
      x={newPos.x}
      y={newPos.y}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();
        evt.currentTarget.opacity(0.5);
        if (container) {
          container.style.cursor = 'grab';
        }
      }}
      onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();
        evt.currentTarget.opacity(1);
        if (container) {
          container.style.cursor = 'default';
        }
      }}>
      {children}
    </Group>
  );
};
