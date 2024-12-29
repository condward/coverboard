import { useEffect, FC } from 'react';

import { Toast } from 'components';
import { CoverBoard } from 'CoverBoard';
import { useShallowMainStore, useMainStore } from 'store';
import { addPrefix, useSaveId } from 'utils';
import { Popovers } from 'components/Popovers';
import { useGetSizesContext } from 'providers';

export const App: FC = () => {
  const saveId = useSaveId();

  const { padding, screenLimits } = useGetSizesContext();

  const { backColor, resetStoreValues } = useShallowMainStore((state) => ({
    resetStoreValues: state.resetStoreValues,
    backColor: state.getBackColor(),
  }));

  useEffect(() => {
    if (!window.localStorage.getItem(addPrefix(saveId))) {
      resetStoreValues();
    }

    useMainStore.persist.setOptions({
      name: addPrefix(saveId),
    });
    void useMainStore.persist.rehydrate();
  }, [resetStoreValues, saveId]);

  return (
    <main
      id="App"
      style={{
        backgroundColor: backColor,
        padding: padding,
        width: screenLimits.width,
        height: screenLimits.height,
        overflow: 'hidden',
      }}>
      <CoverBoard />
      <Toast />
      <Popovers />
    </main>
  );
};
export default App;
