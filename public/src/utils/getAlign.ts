import { PosTypes } from 'types';

export const getAlign = (dir: PosTypes) => {
  if (dir === PosTypes.LEFT) {
    return 'right';
  } else if (dir === PosTypes.RIGHT) {
    return 'left';
  }
  return 'center';
};
