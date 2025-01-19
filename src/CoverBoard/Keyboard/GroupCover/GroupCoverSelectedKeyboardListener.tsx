import { FC, useEffect } from 'react';
import { useSetAtom } from 'jotai';

import { KeyboardShortcuts } from 'types';
import {
  pointsAtom,
  selectedAtom,
  usePoints,
  useShallowMainStore,
} from 'store';

import { GroupCoverPointSelectedKeyboardListener } from './GroupCoverPointSelectedKeyboardListener';

export const GroupCoverSelectedKeyboardListener: FC<{
  index: number;
}> = ({ index }) => {
  const { id, removeGroupAndRelatedArrows, getGroups } = useShallowMainStore(
    (state) => ({
      id: state.getGroupByIdx(index).id,
      removeGroupAndRelatedArrows: state.removeGroupAndRelatedArrows,
      getGroups: state.getGroups,
    }),
  );

  const { pointDirection } = usePoints(id);
  const setSelected = useSetAtom(selectedAtom);
  const setPoints = useSetAtom(pointsAtom);

  useEffect(() => {
    const keyFn = (e: KeyboardEvent) => {
      const key = e.key as KeyboardShortcuts;
      if (e.key === 'Escape') {
        setSelected(null);
        setPoints(null);
        e.preventDefault();
      } else if (e.key === 'Delete' || key === KeyboardShortcuts.DELETE) {
        removeGroupAndRelatedArrows(id);
        e.preventDefault();
      } else if (
        key === KeyboardShortcuts.NEXT ||
        key === KeyboardShortcuts.PREV
      ) {
        const groups = getGroups();
        setSelected({
          id: groups[
            (index +
              (key === KeyboardShortcuts.NEXT ? -1 : 1) +
              groups.length) %
              groups.length
          ].id,
          open: false,
        });
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [
    getGroups,
    id,
    index,
    removeGroupAndRelatedArrows,
    setPoints,
    setSelected,
  ]);

  return pointDirection ? (
    <GroupCoverPointSelectedKeyboardListener
      index={index}
      pointDirection={pointDirection}
    />
  ) : null;
};
