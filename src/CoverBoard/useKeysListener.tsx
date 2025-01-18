import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import {
  editTitleAtom,
  editingTextAtom,
  hideToolbarAtom,
  pointsAtom,
  selectedAtom,
  useShallowMainStore,
} from 'store';
import { KeyboardShortcuts } from 'types';
import { usePreventKeys } from 'utils';

export const useKeysListener = () => {
  const preventKeys = usePreventKeys();

  const { fitToScreen, updateConfigs, getCovers, getGroups } =
    useShallowMainStore((state) => ({
      fitToScreen: state.configs.layout.fitToScreen,
      updateConfigs: state.updateConfigs,
      getCovers: state.getCovers,
      getGroups: state.getGroups,
    }));

  const {
    setHideToolBar,
    setSelected,
    points,
    editTitle,
    isTextSelected,
    selected,
  } = {
    setHideToolBar: useSetAtom(hideToolbarAtom),
    setSelected: useSetAtom(selectedAtom),
    points: useAtomValue(pointsAtom),
    editTitle: useAtomValue(editTitleAtom),
    isTextSelected: !!useAtomValue(editingTextAtom),
    selected: useAtomValue(selectedAtom),
  };
  const hasMode = !!points || !!selected || editTitle || !!isTextSelected;

  useEffect(() => {
    if (preventKeys) return;

    const keyFn = (e: KeyboardEvent) => {
      const covers = getCovers();
      const groups = getGroups();

      if ((e.key as KeyboardShortcuts) === KeyboardShortcuts.HIDE_TOOLBAR) {
        setHideToolBar((prev) => !prev);
        e.preventDefault();
      } else if (
        (e.key as KeyboardShortcuts) === KeyboardShortcuts.FIT_SCREEN
      ) {
        updateConfigs({ layout: { fitToScreen: !fitToScreen } });
        e.preventDefault();
      } else if (
        (e.key as KeyboardShortcuts) === KeyboardShortcuts.NEXT &&
        !hasMode
      ) {
        if (covers.length > 0) {
          setSelected({
            id: covers[covers.length - 1].id,
            open: false,
          });
          e.preventDefault();
        } else if (groups.length > 0) {
          setSelected({
            id: groups[groups.length - 1].id,
            open: false,
          });
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', keyFn);

    return () => window.removeEventListener('keydown', keyFn);
  }, [
    fitToScreen,
    getCovers,
    getGroups,
    hasMode,
    preventKeys,
    setHideToolBar,
    setSelected,
    updateConfigs,
  ]);
};
