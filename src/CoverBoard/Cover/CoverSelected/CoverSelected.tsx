import { FC } from 'react';
import { useAtomValue } from 'jotai';

import { useShallowMainStore, pointsAtom, useGetSelectedId } from 'store';

import { CoverSelectedArrows } from './CoverSelectedArrows';

export const CoverSelected: FC<{
  index: number;
}> = ({ index }) => {
  const { id, getCovers, getGroupsOfCover } = useShallowMainStore((state) => ({
    id: state.getCoverByIdx(index).id,
    getCovers: state.getCovers,
    getGroupsOfCover: state.getGroupsOfCover,
  }));

  const points = useAtomValue(pointsAtom);
  const isSelected = useGetSelectedId(id);

  if (!points && !isSelected) return null;

  if (points) {
    const cover = getCovers().find((cover) => cover.id === points.id);

    if (cover && getGroupsOfCover(cover.id).some((val) => val.id === id)) {
      return null;
    }
  }

  return <CoverSelectedArrows index={index} />;
};
