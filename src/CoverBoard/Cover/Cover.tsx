import { FC } from 'react';

import {
  CoverDraggable,
  CoverLabels,
  CoverLoadImage,
  CoverSelected,
  CoverStars,
} from '.';

export const Cover: FC<{
  index: number;
}> = ({ index }) => {
  return (
    <CoverDraggable index={index}>
      <CoverSelected index={index} />
      <CoverLoadImage index={index} />
      <CoverLabels index={index} />
      <CoverStars index={index} />
    </CoverDraggable>
  );
};
