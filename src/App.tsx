import { useEffect, FC } from 'react';
import { Box } from '@mui/material';

import { Toast } from 'components';
import { CoverBoard } from 'CoverBoard';
import { useMainStore } from 'store';
import { addPrefix, throttle, useSaveId } from 'utils';
import { Popovers } from 'components/Popovers';
export const App: FC = () => {
  const saveId = useSaveId();
  const resetStoreValues = useMainStore((state) => state.resetStoreValues);
  const toobarIconSize = useMainStore((state) => state.getToobarIconSize());
  const backColor = useMainStore((state) => state.getBackColor());
  const setWindowSize = useMainStore((state) => state.setWindowSize);

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
      setWindowSize();
    }, 500);

    window.addEventListener('resize', throttleResize);
    return () => {
      window.removeEventListener('resize', throttleResize);
    };
  }, [setWindowSize]);

  return (
    <main>
      <Box
        className="App"
        sx={{
          backgroundColor: backColor,
          padding: `${toobarIconSize / 2}px`,
        }}>
        <CoverBoard />
        <Toast />
      </Box>
      <Popovers />
    </main>
  );
};
export default App;
