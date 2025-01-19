import { FC } from 'react';

import { useShallowMainStore, useSelected, usePoints } from 'store';

import { CommonSelectedArrows } from 'CoverBoard/Common';

import { CoverPointSelected } from './CoverPointSelected';
import { CoverPointUnselected } from './CoverPointUnselected';

export const CoverSelected: FC<{
  index: number;
}> = ({ index }) => {
  const { id, getCovers, getGroupsOfCover } = useShallowMainStore((state) => ({
    id: state.getCoverByIdx(index).id,
    getCovers: state.getCovers,
    getGroupsOfCover: state.getGroupsOfCover,
  }));

  const { points, pointDirection } = usePoints(id);
  const { selectedId } = useSelected({ id });

  if (!points && !selectedId) return null;

  if (points) {
    const cover = getCovers().find((cover) => cover.id === points.id);

    if (cover && getGroupsOfCover(cover.id).some((val) => val.id === id)) {
      return null;
    }
  }

  return (
    <>
      {pointDirection ? (
        <CoverPointSelected index={index} pointDirection={pointDirection} />
      ) : (
        <CoverPointUnselected index={index} />
      )}
      <CommonSelectedArrows id={id} />
    </>
  );
};
