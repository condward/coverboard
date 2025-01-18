import { FC, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';

import { KeyboardShortcuts, PosTypes } from 'types';
import {
  pointsAtom,
  selectedAtom,
  useGetPointDirection,
  useShallowMainStore,
} from 'store';
import { CommonSelectedArrows } from 'CoverBoard/Common';

export const GroupCoverSelectedArrows: FC<{
  index: number;
}> = ({ index }) => {
  const {
    id,
    scaleX,
    scaleY,
    updateGroup,
    removeGroupAndRelatedArrows,
    getGroups,
  } = useShallowMainStore((state) => {
    const { id, scale } = state.getGroupByIdx(index);

    return {
      scaleX: scale.x,
      scaleY: scale.y,
      id,
      updateGroup: state.updateGroup,
      removeGroupAndRelatedArrows: state.removeGroupAndRelatedArrows,
      getGroups: state.getGroups,
    };
  });

  const pointDirection = useGetPointDirection(id);
  const setSelected = useSetAtom(selectedAtom);
  const setPoints = useSetAtom(pointsAtom);

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
      } else if (e.key === 'Escape') {
        setPoints(null);
        e.preventDefault();
      } else if (
        e.key === 'Delete' ||
        (e.key as KeyboardShortcuts) === KeyboardShortcuts.DELETE
      ) {
        removeGroupAndRelatedArrows(id);
        e.preventDefault();
      } else if ((e.key as KeyboardShortcuts) === KeyboardShortcuts.NEXT) {
        const groups = getGroups();
        if (index > -1 && Boolean(groups[index - 1])) {
          setSelected({
            id: groups[index - 1].id,
            open: false,
          });
          e.preventDefault();
        } else {
          setSelected({
            id: groups[groups.length - 1].id,
            open: false,
          });
          e.preventDefault();
        }
      } else if ((e.key as KeyboardShortcuts) === KeyboardShortcuts.PREV) {
        const groups = getGroups();
        if (index > -1 && Boolean(groups[index + 1])) {
          setSelected({
            id: groups[index + 1].id,
            open: false,
          });
          e.preventDefault();
        } else {
          setSelected({ id: groups[0].id, open: false });
          e.preventDefault();
        }
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [
    getGroups,
    id,
    index,
    removeGroupAndRelatedArrows,
    pointDirection,
    setPoints,
    setSelected,
    updateGroup,
  ]);

  return <CommonSelectedArrows id={id} scaleX={scaleX} scaleY={scaleY} />;
};
