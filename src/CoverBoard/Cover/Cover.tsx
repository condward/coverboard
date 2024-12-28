import { FC } from 'react';

import { CommonDrawArrow } from 'CoverBoard/Common';

import { CoverDraggable, CoverLabels, CoverLoadImage } from '.';
import { CoverStars } from './CoverStars';

export const Cover: FC<{
  index: number;
}> = ({ index }) => {
  return (
    <CoverDraggable index={index}>
      <CommonDrawArrow index={index} type="cover" />
      <CoverLoadImage index={index} />
      <CoverLabels index={index} />
      <CoverStars index={index} />
    </CoverDraggable>
  );
};
