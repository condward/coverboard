import { useAtom, useAtomValue } from 'jotai';
import { FC, useEffect, useMemo, ReactNode } from 'react';

import { useShallowMainStore, sizeAtom, hideToolbarAtom } from 'store';
import { MAX_BOUNDARY } from 'types';
import { throttle, useIsLandscape } from 'utils';

import { SizesContext } from './useGetSizesContext';

export const SizesProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const isLandscape = useIsLandscape();

  const { fitToScreen, heightRatio, scale } = useShallowMainStore((state) => ({
    fitToScreen: state.configs.layout.fitToScreen,
    heightRatio: state.getHeightRatio(),
    scale: state.configs.layout.scale,
  }));

  const { screenSize, updateSize, hideToolbar } = {
    screenSize: useAtomValue(sizeAtom),
    updateSize: useAtom(sizeAtom)[1],
    hideToolbar: useAtomValue(hideToolbarAtom),
  };

  const width = screenSize.width;
  const height = screenSize.height;
  const padding = scale / 4;
  const compensation = !hideToolbar ? scale / 2 + 3 * padding + 12 : 6;

  useEffect(() => {
    const throttleResize = throttle(() => {
      if (fitToScreen) {
        updateSize({
          width: Math.max(500, Math.min(MAX_BOUNDARY, window.innerWidth)),
          height: Math.max(500, Math.min(MAX_BOUNDARY, window.innerHeight)),
        });
      }
    }, 500);

    window.addEventListener('resize', throttleResize);
    return () => {
      window.removeEventListener('resize', throttleResize);
    };
  }, [fitToScreen, updateSize]);

  return (
    <SizesContext
      value={useMemo(
        () => ({
          circleRadius: scale / 10,
          fontSize: scale / 7,
          starRadius: (scale / 10) * 0.8,
          padding,
          coverSizeWidth: scale,
          coverSizeHeight: scale * heightRatio,
          canvasLimits: fitToScreen
            ? {
                width: isLandscape
                  ? width - compensation - 2 * padding
                  : width - 2 * padding,
                height: isLandscape
                  ? height - 2 * padding
                  : height - compensation - 2 * padding,
              }
            : {
                width,
                height,
              },
          screenLimits: fitToScreen
            ? {
                width: width - 2 * padding,
                height: height - 2 * padding,
              }
            : {
                width: isLandscape ? width + compensation : width,
                height: isLandscape ? height : height + compensation,
              },
        }),
        [
          scale,
          padding,
          fitToScreen,
          isLandscape,
          width,
          height,
          heightRatio,
          compensation,
        ],
      )}>
      {children}
    </SizesContext>
  );
};
