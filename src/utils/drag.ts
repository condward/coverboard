import { KonvaEventObject } from 'konva/lib/Node';

export const isTouchEvent = (
  e: KonvaEventObject<DragEvent | TouchEvent>,
): e is KonvaEventObject<TouchEvent> => {
  return e.evt.type === 'touchend';
};

const isMouseEvent = (
  e: KonvaEventObject<DragEvent | TouchEvent>,
): e is KonvaEventObject<DragEvent> => {
  return e.evt.type === 'mouseup';
};

export const getClientPosition = (
  e: KonvaEventObject<DragEvent | TouchEvent>,
) => {
  let x = 0;
  let y = 0;
  if (isTouchEvent(e)) {
    x = e.evt.changedTouches[0].clientX;
    y = e.evt.changedTouches[0].clientY;
  } else if (isMouseEvent(e)) {
    x = e.evt.x;
    y = e.evt.y;
  }

  return { x, y };
};
