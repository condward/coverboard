import { FC } from 'react';
import { useAtomValue } from 'jotai';

import { useShallowMainStore, pointsAtom, useGetSelectedId } from 'store';

import { GroupCoverSelectedArrows } from './GroupCoverSelectedArrows';

export const GroupCoverSelected: FC<{
  index: number;
}> = ({ index }) => {
  const {
    id,
    getGroups,
    getGroupsOfGroup,
    getGroupsInsideGroup,
    getCoversInsideGroup,
  } = useShallowMainStore((state) => ({
    id: state.getGroupByIdx(index).id,
    getGroups: state.getGroups,
    getGroupsOfGroup: state.getGroupsOfGroup,
    getGroupsInsideGroup: state.getGroupsInsideGroup,
    getCoversInsideGroup: state.getCoversInsideGroup,
  }));

  const points = useAtomValue(pointsAtom);
  const isSelected = useGetSelectedId(id);

  if (!points && !isSelected) return null;

  if (points) {
    const group = getGroups().find((group) => group.id === points.id);

    if (
      group &&
      (getGroupsOfGroup(group.id).some((val) => val.id === id) ||
        getGroupsInsideGroup(group.id).some((val) => val.id === id) ||
        getCoversInsideGroup(group.id).some((val) => val.id === id))
    ) {
      return null;
    }
  }

  return <GroupCoverSelectedArrows index={index} />;
};
