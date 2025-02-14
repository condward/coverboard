import { FC } from 'react';

import { useShallowMainStore, useSelected, usePoints } from 'store';

import { CommonSelectedArrows } from 'CoverBoard/Common';

import { GroupCoverSelectedKeyboardListener } from 'CoverBoard/Keyboard';

export const GroupCoverSelected: FC<{
  index: number;
}> = ({ index }) => {
  const {
    id,
    scaleX,
    scaleY,
    getGroups,
    getGroupsOfGroup,
    getGroupsInsideGroup,
    getCoversInsideGroup,
  } = useShallowMainStore((state) => {
    const { scale, id } = state.getGroupByIdx(index);

    return {
      id,
      scaleX: scale.x,
      scaleY: scale.y,
      getGroups: state.getGroups,
      getGroupsOfGroup: state.getGroupsOfGroup,
      getGroupsInsideGroup: state.getGroupsInsideGroup,
      getCoversInsideGroup: state.getCoversInsideGroup,
    };
  });

  const { points } = usePoints(id);
  const { selectedId } = useSelected({ id });

  if (!points && !selectedId) return null;

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

  return (
    <>
      {selectedId && <GroupCoverSelectedKeyboardListener index={index} />}
      <CommonSelectedArrows id={id} scaleX={scaleX} scaleY={scaleY} />
    </>
  );
};
