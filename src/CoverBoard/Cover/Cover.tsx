import { FC } from 'react';

import { CommonDrawArrow } from 'CoverBoard/Common';
import { CoverSchema } from 'types';

import { CoverDraggable, CoverLabels, CoverLoadImage } from '.';
import { CoverStars } from './CoverStars';

export const Cover: FC<{
  cover: CoverSchema;
  renderTime: number;
}> = ({ cover, renderTime }) => {
  const { id, link } = cover;

  return (
    <CoverDraggable cover={cover}>
      <CommonDrawArrow id={id} />
      <CoverLoadImage id={id} link={link} renderTime={renderTime} />
      <CoverLabels cover={cover} />
      <CoverStars cover={cover} />
    </CoverDraggable>
  );
};
