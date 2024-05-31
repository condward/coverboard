import { KonvaEventObject } from 'konva/lib/Node';

export const isTouchEvent = (
  event: KonvaEventObject<DragEvent | TouchEvent>,
): event is KonvaEventObject<TouchEvent> => {
  return event.evt.type === 'touchend';
};

const isMouseEvent = (
  event: KonvaEventObject<DragEvent | TouchEvent>,
): event is KonvaEventObject<DragEvent> => {
  return event.evt.type === 'mouseup';
};

export const getClientPosition = (
  event: KonvaEventObject<DragEvent | TouchEvent>,
) => {
  let x = 0;
  let y = 0;
  if (isTouchEvent(event)) {
    x = event.evt.changedTouches[0].clientX;
    y = event.evt.changedTouches[0].clientY;
  } else if (isMouseEvent(event)) {
    x = event.evt.x;
    y = event.evt.y;
  }

  return { x, y };
};
