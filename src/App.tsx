import { Toast } from 'components';
import { CoverBoard } from 'CoverBoard';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMainStore } from 'store';
import { DEFAULT_KEY } from 'types';
import { throttle } from 'utils';

function App() {
  const { saveId = DEFAULT_KEY } = useParams();
  const setDefaultLocalStoreValues = useMainStore(
    (state) => state.setDefaultLocalStoreValues,
  );
  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const backColor = useMainStore((state) => state.getBackColor());
  const setWindowSize = useMainStore((state) => state.setWindowSize);

  useEffect(() => {
    setDefaultLocalStoreValues(saveId);
  }, [saveId, setDefaultLocalStoreValues]);

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
    <div
      className="App"
      style={{
        backgroundColor: backColor,
        padding: toobarIconSize / 2 + 'px',
      }}>
      <CoverBoard />
      <Toast />
    </div>
  );
}
export default App;
