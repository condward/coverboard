import { Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useState, ReactNode, FC } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ArrowParams, ArrowSchema, PosTypes } from 'types';
import { getClientPosition } from 'utils';
import { useGetSizesContext } from 'providers';

interface DraggableGroupProps {
  children: ReactNode;
  dir: ArrowSchema['title']['dir'];
  setUpdate: (dir: PosTypes) => void;
  ArrowParams: ArrowParams;
}

const useGetNewPos = (dir: DraggableGroupProps['dir']) => {
  const { coverSizeWidth, circleRadius } = useGetSizesContext();

  if (dir === PosTypes.BOTTOM) {
    return {
      x: 0,
      y: 0,
    };
  } else if (dir === PosTypes.TOP) {
    return {
      x: 0,
      y: -1.5 * 4 * circleRadius,
    };
  } else if (dir === PosTypes.RIGHT) {
    return {
      x: coverSizeWidth + 3 * circleRadius,
      y: -1.5 * 2 * circleRadius,
    };
  } else {
    return {
      x: -coverSizeWidth - 3 * circleRadius,
      y: -1.5 * 2 * circleRadius,
    };
  }
};

const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
  e.cancelBubble = true;
  e.currentTarget.opacity(0.5);
  const container = e.target.getStage()?.container();

  if (container) {
    container.style.cursor = 'grab';
  }
};

export const ArrowLabelDraggable: FC<DraggableGroupProps> = ({
  dir,
  ArrowParams,
  setUpdate,
  children,
}) => {
  const { fontSize } = useGetSizesContext();
  const [id, setId] = useState(uuidv4());
  const newPos = useGetNewPos(dir);

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    e.currentTarget.opacity(1);
    e.cancelBubble = true;
    const container = e.target.getStage()?.container();

    if (container) {
      container.style.cursor = 'grab';
    }

    const { x, y } = getClientPosition(e);

    let dir: PosTypes;
    if (y > ArrowParams.midY + 2 * fontSize) {
      dir = PosTypes.BOTTOM;
    } else if (y < ArrowParams.midY - 1.2 * fontSize) {
      dir = PosTypes.TOP;
    } else if (x < ArrowParams.midX) {
      dir = PosTypes.LEFT;
    } else {
      dir = PosTypes.RIGHT;
    }
    setId(uuidv4());
    setUpdate(dir);
  };

  return (
    <Group
      key={id}
      x={newPos.x}
      y={newPos.y}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();
        evt.currentTarget.opacity(0.5);
        if (container) {
          container.style.cursor = 'grab';
        }
      }}
      onMouseUp={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();
        evt.currentTarget.opacity(1);
        if (container) {
          container.style.cursor = 'default';
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
