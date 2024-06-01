import { useAtomValue } from 'jotai';
import { FC, createContext, useCallback, useMemo } from 'react';

import {
  useMainStore,
  sizeAtom,
  hideToolbarAtom,
  toolbarDragAtom,
} from 'store';
import { ToolConfigIDs, DragLimits } from 'types';
import { useIsLandscape } from 'utils';

interface SizesProviderProps {
  toolbarIconSize: number;
  starRadius: number;
  circleRadius: number;
  fontSize: number;
  dragLimits: DragLimits;
  toolbarLimits: DragLimits;
  coverSizeWidth: number;
  coverSizeHeight: number;
  stageLimits: {
    width: number;
    height: number;
    padding: number;
  };
  getCurrentY: (index: number) => number;
}

export const SizesContext = createContext<SizesProviderProps | null>(null);

export const SizesProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const scale = useMainStore((state) => state.configs.size);
  const heightRatio = useMainStore((state) => state.getHeightRatio());
  const screenSize = useAtomValue(sizeAtom);
  const isToolbarHidden = useAtomValue(hideToolbarAtom);
  const toolbarDrag = useAtomValue(toolbarDragAtom);
  const isLandscape = useIsLandscape();

  const baseScales = useMemo(
    () => ({
      toolbarIconSize: scale / 2.5,
      circleRadius: scale / 7 / 1.5,
    }),
    [scale],
  );

  const getCurrentY = useCallback(
    (index: number) =>
      0 + index * (baseScales.toolbarIconSize + baseScales.toolbarIconSize / 2),
    [baseScales.toolbarIconSize],
  );

  return (
    <SizesContext.Provider
      value={useMemo(
        () => ({
          toolbarIconSize: baseScales.toolbarIconSize,
          circleRadius: baseScales.circleRadius,
          getCurrentY,
          fontSize: scale / 7,
          starRadius: baseScales.circleRadius * 0.8,
          stageLimits: {
            width: screenSize.width - baseScales.toolbarIconSize / 2,
            height: screenSize.height - baseScales.toolbarIconSize / 2,
            padding: baseScales.toolbarIconSize / 2,
          },
          dragLimits:
            isToolbarHidden || toolbarDrag
              ? {
                  x: 0,
                  y: 0,
                  width: screenSize.width - baseScales.toolbarIconSize / 2,
                  height: screenSize.height - baseScales.toolbarIconSize / 2,
                }
              : {
                  x: isLandscape ? 2.5 * baseScales.toolbarIconSize : 0,
                  y: isLandscape ? 0 : 2.5 * baseScales.toolbarIconSize,
                  width: isLandscape
                    ? screenSize.width - 3 * baseScales.toolbarIconSize
                    : screenSize.width - baseScales.toolbarIconSize / 2,
                  height: isLandscape
                    ? screenSize.height - baseScales.toolbarIconSize / 2
                    : screenSize.height - 3 * baseScales.toolbarIconSize,
                },
          toolbarLimits: {
            x: 0,
            y: 0,
            width: baseScales.toolbarIconSize * 2,
            height:
              getCurrentY(Object.keys(ToolConfigIDs).length - 1) +
              2 * baseScales.toolbarIconSize,
          },
          coverSizeWidth: scale,
          coverSizeHeight: scale * heightRatio,
        }),
        [
          baseScales.toolbarIconSize,
          baseScales.circleRadius,
          getCurrentY,
          scale,
          screenSize.width,
          screenSize.height,
          isToolbarHidden,
          toolbarDrag,
          isLandscape,
          heightRatio,
        ],
      )}>
      {children}
    </SizesContext.Provider>
  );
};
