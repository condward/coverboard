import { useGetSizesContext } from 'providers';
import { PosTypes } from 'types';
import { useIsLandscape } from 'utils';

interface OffsetCalc<T> {
  dir: PosTypes;
  type: T;
}

export const useGetElementSizes = <T>(totalDirArray: Array<OffsetCalc<T>>) => {
  const { fontSize, coverSizeWidth, coverSizeHeight, canvasLimits } =
    useGetSizesContext();
  const isLandscape = useIsLandscape();

  return {
    getOffset(offset: OffsetCalc<T>) {
      const dirArray = totalDirArray.flatMap((val) =>
        val.dir === offset.dir ? val : [],
      );

      if (dirArray.length === 0) {
        return 0;
      }

      const index = dirArray.findIndex((val) => val.type === offset.type);
      if (offset.dir === PosTypes.TOP) {
        return -(dirArray.length - 1 - index) * 1.5 * fontSize;
      } else if (offset.dir === PosTypes.BOTTOM) {
        return index * 1.5 * fontSize;
      } else {
        return (
          fontSize / 2 + (index - (dirArray.length - 1) / 2) * fontSize * 1.5
        );
      }
    },
    getXPosition(currentDir: PosTypes, scale = { x: 1, y: 1 }) {
      if (currentDir === PosTypes.BOTTOM || currentDir === PosTypes.TOP) {
        return (coverSizeWidth * scale.x) / 2 - (coverSizeWidth * 3) / 2;
      } else if (currentDir === PosTypes.RIGHT) {
        return -coverSizeWidth * scale.y;
      }
      return coverSizeWidth * scale.x * 2 - coverSizeWidth * 3;
    },
    getMaxBoundaries(scale = { x: 1, y: 1 }) {
      return {
        x: isLandscape
          ? canvasLimits.width - coverSizeWidth * scale.x
          : canvasLimits.width - coverSizeWidth * scale.x,
        y: isLandscape
          ? canvasLimits.height - coverSizeHeight * scale.y
          : canvasLimits.height - coverSizeHeight * scale.y,
      };
    },
  };
};

export const useGetMaxBoundaries = () => {
  const { coverSizeWidth, coverSizeHeight, canvasLimits } =
    useGetSizesContext();
  const isLandscape = useIsLandscape();

  return {
    getMaxBoundaries: (scale = { x: 1, y: 1 }) => ({
      x: isLandscape
        ? canvasLimits.width - coverSizeWidth * scale.x
        : canvasLimits.width - coverSizeWidth * scale.x,
      y: isLandscape
        ? canvasLimits.height - coverSizeHeight * scale.y
        : canvasLimits.height - coverSizeHeight * scale.y,
    }),
  };
};
