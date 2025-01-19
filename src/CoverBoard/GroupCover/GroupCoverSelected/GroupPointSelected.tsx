import { FC, useEffect } from 'react';

import { useShallowMainStore } from 'store';
import { PosTypes } from 'types';

interface GroupPointSelected {
  index: number;
  pointDirection: PosTypes;
}

export const GroupPointSelected: FC<GroupPointSelected> = ({
  index,
  pointDirection,
}) => {
  const { id, updateGroup, getGroups } = useShallowMainStore((state) => {
    return {
      id: state.getGroupByIdx(index).id,
      updateGroup: state.updateGroup,
      getGroups: state.getGroups,
    };
  });

  useEffect(() => {
    const keyFn = (e: KeyboardEvent) => {
      if (
        e.key === 'ArrowRight' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown'
      ) {
        const group = getGroups().find((group) => id === group.id);

        if (group) {
          if (e.key === 'ArrowRight' && pointDirection === PosTypes.RIGHT) {
            updateGroup(group.id, { pos: { x: group.pos.x + 1 } });
            e.preventDefault();
          } else if (
            e.key === 'ArrowLeft' &&
            pointDirection === PosTypes.LEFT
          ) {
            updateGroup(group.id, { pos: { x: group.pos.x - 1 } });
            e.preventDefault();
          } else if (e.key === 'ArrowUp' && pointDirection === PosTypes.TOP) {
            updateGroup(group.id, { pos: { y: group.pos.y - 1 } });
            e.preventDefault();
          } else if (
            e.key === 'ArrowDown' &&
            pointDirection === PosTypes.BOTTOM
          ) {
            updateGroup(group.id, { pos: { y: group.pos.y + 1 } });
            e.preventDefault();
          }
        }
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [getGroups, pointDirection, updateGroup, id]);

  return null;
};
