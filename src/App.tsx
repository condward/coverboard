import { useEffect, FC } from 'react';
import { useSetAtom } from 'jotai';

import { Toast } from 'components';
import { CoverBoard } from 'CoverBoard';
import { sizeAtom, store, useMainStore } from 'store';
import { addPrefix, throttle, useSaveId } from 'utils';
import { Popovers } from 'components/Popovers';
import { useGetSizesContext } from 'providers';

export const App: FC = () => {
  const saveId = useSaveId();
  const resetStoreValues = useMainStore((state) => state.resetStoreValues);
  const backColor = useMainStore((state) => state.getBackColor());
  const setWindowSize = useSetAtom(sizeAtom);
  const fitToScreen = useMainStore((state) => state.configs.layout.fitToScreen);
  const { toolbarIconSize, stageLimits } = useGetSizesContext();

  useEffect(() => {
    if (!window.localStorage.getItem(addPrefix(saveId))) {
      resetStoreValues();
    }

    useMainStore.persist.setOptions({
      name: addPrefix(saveId),
    });
    void useMainStore.persist.rehydrate();
  }, [resetStoreValues, saveId]);

  useEffect(() => {
    const throttleResize = throttle(() => {
      if (fitToScreen) {
        store.set(sizeAtom, {
          width: window.innerWidth - toolbarIconSize / 2,
          height: window.innerHeight - toolbarIconSize / 2,
        });
      }
    }, 500);

    throttleResize();
    window.addEventListener('resize', throttleResize);
    return () => {
      window.removeEventListener('resize', throttleResize);
    };
  }, [fitToScreen, setWindowSize, toolbarIconSize]);

  return (
    <main
      id="App"
      style={{
        width: stageLimits.width - 1,
        height: stageLimits.height - 1,
        backgroundColor: backColor,
        padding: stageLimits.padding,
      }}>
      <CoverBoard />
      <Toast />
      <Popovers />
    </main>
  );
};
export default App;
