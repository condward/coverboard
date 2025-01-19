import { useSetAtom } from 'jotai';
import { FC, useEffect } from 'react';

import { hideToolbarAtom, useShallowMainStore } from 'store';
import { KeyboardShortcuts } from 'types';
import { usePreventKeys } from 'utils';

export const MainKeyboardListener: FC = () => {
  const preventKeys = usePreventKeys();

  const { fitToScreen, updateConfigs } = useShallowMainStore((state) => ({
    fitToScreen: state.configs.layout.fitToScreen,
    updateConfigs: state.updateConfigs,
  }));
  const setHideToolBar = useSetAtom(hideToolbarAtom);

  useEffect(() => {
    if (preventKeys) return;

    const keyFn = (e: KeyboardEvent) => {
      const key = e.key as KeyboardShortcuts;

      if (key === KeyboardShortcuts.HIDE_TOOLBAR) {
        setHideToolBar((prev) => !prev);
        e.preventDefault();
      } else if (key === KeyboardShortcuts.FIT_SCREEN) {
        updateConfigs({ layout: { fitToScreen: !fitToScreen } });
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', keyFn);

    return () => window.removeEventListener('keydown', keyFn);
  }, [fitToScreen, preventKeys, setHideToolBar, updateConfigs]);

  return null;
};
