import { useAtomValue } from 'jotai';
import { FC, createContext, useMemo } from 'react';

import { useMainStore, sizeAtom } from 'store';
import { DragLimits, SPACING_GAP } from 'types';
import { useIsLandscape } from 'utils';

interface SizesProviderProps {
  toolbarIconSize: number;
  starRadius: number;
  circleRadius: number;
  fontSize: number;
  dragLimits: DragLimits;
  appLimits: DragLimits;
  coverSizeWidth: number;
  coverSizeHeight: number;
  padding: number;
}

export const SizesContext = createContext<SizesProviderProps | null>(null);

export const SizesProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const scale = useMainStore((state) => state.configs.layout.scale);
  const heightRatio = useMainStore((state) => state.getHeightRatio());
  const screenSize = useAtomValue(sizeAtom);
  const isLandscape = useIsLandscape();

  const baseScales = useMemo(
    () => ({
      toolbarIconSize: scale / 2.5,
    }),
    [scale],
  );

  const padding = baseScales.toolbarIconSize / 2;
  const width = screenSize.width - padding;
  const height = screenSize.height - padding;

  return (
    <SizesContext.Provider
      value={useMemo(
        () => ({
          toolbarIconSize: baseScales.toolbarIconSize,
          circleRadius: scale / 10,
          fontSize: scale / 7,
          starRadius: (scale / 10) * 0.8,
          padding,
          appLimits: {
            x: 0,
            y: 0,
            width,
            height,
          },
          dragLimits: {
            x: 0,
            y: 0,
            width: isLandscape ? width - scale - SPACING_GAP * 8 : width,
            height: isLandscape ? height : height - scale - SPACING_GAP * 8,
          },
          coverSizeWidth: scale,
          coverSizeHeight: scale * heightRatio,
        }),
        [
          baseScales.toolbarIconSize,
          scale,
          padding,
          width,
          height,
          isLandscape,
          heightRatio,
        ],
      )}>
      {children}
    </SizesContext.Provider>
  );
};
