import { FC, useEffect } from 'react';
import { useSetAtom } from 'jotai';

import { KeyboardShortcuts } from 'types';
import { pointsAtom, selectedAtom, useShallowMainStore } from 'store';

export const GroupPointUnselected: FC<{
  index: number;
}> = ({ index }) => {
  const { id, removeGroupAndRelatedArrows, getGroups } = useShallowMainStore(
    (state) => {
      return {
        id: state.getGroupByIdx(index).id,
        removeGroupAndRelatedArrows: state.removeGroupAndRelatedArrows,
        getGroups: state.getGroups,
      };
    },
  );

  const setSelected = useSetAtom(selectedAtom);
  const setPoints = useSetAtom(pointsAtom);

  useEffect(() => {
    const keyFn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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
    setPoints,
    setSelected,
  ]);

  return null;
};
