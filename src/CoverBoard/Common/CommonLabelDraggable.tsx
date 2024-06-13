import { Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { CoverSchema, GroupSchema, PosTypes } from 'types';
import { getClientPosition } from 'utils';
import { useGetSizesContext } from 'providers';

interface CommonLabelDraggableProps {
  children: ReactNode;
  x: CoverSchema['pos']['x'] | GroupSchema['pos']['x'];
  y: CoverSchema['pos']['y'] | GroupSchema['pos']['y'];
  dir: PosTypes;
  scaleX?: GroupSchema['scale']['x'];
  scaleY?: GroupSchema['scale']['y'];
  updateDir: (dir: PosTypes) => void;
}

interface UseGetNewPos {
  dir: CommonLabelDraggableProps['dir'];
  scaleX: NonNullable<CommonLabelDraggableProps['scaleX']>;
  scaleY: NonNullable<CommonLabelDraggableProps['scaleY']>;
}

const useGetNewPos = ({ dir, scaleX, scaleY }: UseGetNewPos) => {
  const { fontSize, coverSizeWidth, coverSizeHeight } = useGetSizesContext();

  if (dir === PosTypes.BOTTOM) {
    return {
      x: 0,
      y: fontSize,
    };
  } else if (dir === PosTypes.TOP) {
    return {
      x: 0,
      y: -coverSizeHeight * scaleY - fontSize - fontSize,
    };
  } else if (dir === PosTypes.RIGHT) {
    return {
      x: 2 * coverSizeWidth * scaleX + fontSize,
      y: (-coverSizeHeight * scaleY) / 2 - fontSize,
    };
  } else {
    return {
      x: -2 * coverSizeWidth * scaleX - fontSize,
      y: (-coverSizeHeight * scaleY) / 2 - fontSize,
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

export const CommonLabelDraggable = ({
  x,
  y,
  dir,
  children,
  scaleX = 1,
  scaleY = 1,
  updateDir,
}: CommonLabelDraggableProps) => {
  const { dragLimits, coverSizeHeight } = useGetSizesContext();
  const [randId, setId] = useState(uuidv4());

  const newPos = useGetNewPos({ dir, scaleX, scaleY });

  const handleDragEnd = (e: KonvaEventObject<DragEvent | TouchEvent>) => {
    e.cancelBubble = true;
    const container = e.target.getStage()?.container();

    if (container) {
      container.style.cursor = 'grab';
    }

    const { x: xAbs, y: yAbs } = getClientPosition(e);

    let newDir: PosTypes;
    if (yAbs > dragLimits.y + y + coverSizeHeight * scaleY) {
      newDir = PosTypes.BOTTOM;
    } else if (yAbs < y + dragLimits.y) {
      newDir = PosTypes.TOP;
    } else if (xAbs < x + dragLimits.x) {
      newDir = PosTypes.LEFT;
    } else {
      newDir = PosTypes.RIGHT;
    }

    setId(uuidv4());
    updateDir(newDir);
  };

  return (
    <Group
      key={randId}
      x={newPos.x}
      y={newPos.y}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseUp={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();
        evt.currentTarget.opacity(1);
        if (container) {
          container.style.cursor = 'default';
        }
      }}
      onMouseEnter={(evt: KonvaEventObject<MouseEvent>) => {
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
