import { Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useMemo, useState } from 'react';
import { Covers, GroupCovers, PosTypes } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { getClientPosition } from 'utils';
import { useMainStore } from 'store';
import { shallow } from 'zustand/shallow';

interface CommonLabelDraggableProps {
  children: React.ReactNode;
  id: Covers['id'] | GroupCovers['id'];
  x: Covers['x'] | GroupCovers['x'];
  y: Covers['y'] | GroupCovers['y'];
  dir: PosTypes;
  scaleX?: GroupCovers['scaleX'];
  scaleY?: GroupCovers['scaleY'];
  updateDir: (coverId: string, dir: PosTypes) => void;
}

export const CommonLabelDraggable = ({
  id,
  x,
  y,
  dir,
  children,
  scaleX = 1,
  scaleY = 1,
  updateDir,
}: CommonLabelDraggableProps) => {
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);
  const fontSize = useMainStore((state) => state.fontSize());
  const coverSizeWidth =
    useMainStore((state) => state.coverSizeWidth()) * scaleX;
  const coverSizeHeight =
    useMainStore((state) => state.coverSizeHeight()) * scaleY;
  const [randId, setId] = useState(uuidv4());

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    const container = e.target.getStage()?.container();

    if (container) {
      container.style.cursor = 'grab';
    }
  };

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
    updateDir(id, newDir);
  };

  const newPos = useMemo(() => {
    if (dir === PosTypes.BOTTOM) {
      return {
        x: 0,
        y: fontSize / 2,
      };
    } else if (dir === PosTypes.TOP) {
      return {
        x: 0,
        y: -coverSizeHeight - 2 * fontSize,
      };
    } else if (dir === PosTypes.RIGHT) {
      return {
        x: 2 * coverSizeWidth + fontSize,
        y: -coverSizeHeight / 2 - fontSize,
      };
    } else {
      return {
        x: -2 * coverSizeWidth - fontSize,
        y: -coverSizeHeight / 2 - fontSize,
      };
    }
  }, [coverSizeHeight, coverSizeWidth, dir, fontSize]);

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
