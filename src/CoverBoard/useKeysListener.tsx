import { useAtom, useAtomValue, useSetAtom } from 'jotai';
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
  const { fitToScreen, updateConfigs, getCovers, getGroups } =
    useShallowMainStore((state) => ({
      fitToScreen: state.configs.layout.fitToScreen,
      updateConfigs: state.updateConfigs,
      getCovers: state.getCovers,
      getGroups: state.getGroups,
    }));

  const setHideToolBar = useSetAtom(hideToolbarAtom);

  const points = useAtomValue(pointsAtom);

  const [selected, setSelected] = useAtom(selectedAtom);
  const editTitle = useAtomValue(editTitleAtom);

  const isTextSelected = !!useAtomValue(editingTextAtom);
  const hasMode = !!points || !!selected || editTitle || !!isTextSelected;
  const preventKeys = usePreventKeys();

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
    editTitle,
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
