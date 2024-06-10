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
  outsideLimits: DragLimits;
  toolbarBorderLimits: DragLimits;
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
  const scale = useMainStore((state) => state.configs.layout.scale);
  const heightRatio = useMainStore((state) => state.getHeightRatio());
  const screenSize = useAtomValue(sizeAtom);
  const isToolbarHidden = useAtomValue(hideToolbarAtom);
  const toolbarDrag = useAtomValue(toolbarDragAtom);
  const isLandscape = useIsLandscape();

  const baseScales = useMemo(
    () => ({
      toolbarIconSize: scale / 2.5,
    }),
    [scale],
  );

  const padding = baseScales.toolbarIconSize / 2;
  const outsideScreenWidth = 2.5 * baseScales.toolbarIconSize;
  const width = screenSize.width - padding;
  const height = screenSize.height - padding;

  const getCurrentY = useCallback(
    (index: number) => 0 + index * (baseScales.toolbarIconSize + padding),
    [baseScales.toolbarIconSize, padding],
  );

  const toolbarLimits = useMemo(
    () => ({
      x: 0,
      y: 0,
      width: padding * 4,
      height: getCurrentY(Object.keys(ToolConfigIDs).length - 1) + padding * 4,
    }),
    [getCurrentY, padding],
  );

  return (
    <SizesContext.Provider
      value={useMemo(
        () => ({
          toolbarIconSize: baseScales.toolbarIconSize,
          circleRadius: scale / 10,
          getCurrentY,
          fontSize: scale / 7,
          starRadius: (scale / 10) * 0.8,
          stageLimits: {
            width,
            height,
            padding,
          },
          dragLimits:
            isToolbarHidden || toolbarDrag
              ? {
                  x: 0,
                  y: 0,
                  width,
                  height,
                }
              : {
                  x: isLandscape ? outsideScreenWidth : 0,
                  y: isLandscape ? 0 : outsideScreenWidth,
                  width: isLandscape ? width - outsideScreenWidth : width,
                  height: isLandscape ? height : height - outsideScreenWidth,
                },
          toolbarLimits,
          toolbarBorderLimits: {
            x: 1,
            y: 1,
            width:
              (isLandscape ? toolbarLimits.width : toolbarLimits.height) - 2,
            height:
              (isLandscape ? toolbarLimits.height : toolbarLimits.width) - 2,
          },
          outsideLimits: {
            x: 0,
            y: 0,
            width:
              padding + (isLandscape ? toolbarLimits.width : screenSize.width),
            height:
              padding + (isLandscape ? screenSize.height : toolbarLimits.width),
          },
          coverSizeWidth: scale,
          coverSizeHeight: scale * heightRatio,
        }),
        [
          baseScales.toolbarIconSize,
          scale,
          getCurrentY,
          width,
          height,
          padding,
          isToolbarHidden,
          toolbarDrag,
          isLandscape,
          outsideScreenWidth,
          toolbarLimits,
          screenSize.width,
          screenSize.height,
          heightRatio,
        ],
      )}>
      {children}
    </SizesContext.Provider>
  );
};
