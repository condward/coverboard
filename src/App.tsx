import { useEffect, FC } from 'react';

import { Toast } from 'components';
import { CoverBoard } from 'CoverBoard';
import { useMainStore } from 'store';
import { addPrefix, useSaveId } from 'utils';
import { Popovers } from 'components/Popovers';
import { useGetSizesContext } from 'providers';

export const App: FC = () => {
  const saveId = useSaveId();
  const resetStoreValues = useMainStore((state) => state.resetStoreValues);
  const backColor = useMainStore((state) => state.getBackColor());
  const { padding, screenLimits } = useGetSizesContext();

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
