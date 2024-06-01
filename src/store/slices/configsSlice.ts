import { StateCreator } from 'zustand';

import { sizeAtom, store } from 'store';
import {
  Colors,
  BackColors,
  PosTypes,
  ConfigSchema,
  colorMap,
  backColorMap,
  Media,
  MediaDesc,
  mediaMap,
} from 'types';

const getSize = () => {
  const size = Math.min(150, Math.max(70, window.innerWidth / 20));
  return Math.ceil(size / 10) * 10;
};
export const initialConfigValues = (): ConfigSchema => ({
  size: getSize(),
  title: '',
  fitToScreen: true,
  width: 500,
  height: 500,
  color: Colors.YELLOW,
  arrowColor: Colors.YELLOW,
  coverColor: Colors.ORANGE,
  groupColor: Colors.GREEN,
  backColor: BackColors.DARK,
  showTitle: true,
  showSubtitle: true,
  showArrow: true,
  showMainTitle: true,
  labelDir: PosTypes.BOTTOM,
  starsDir: PosTypes.BOTTOM,
  groupDir: PosTypes.TOP,
  media: Media.MUSIC,
  showStars: true,
});

export interface UseConfigsParams {
  configs: ConfigSchema;
  resetConfigs: () => void;
  updateConfigs: (newConfig: Partial<ConfigSchema>) => void;
  resetTitle: () => void;
  getColor: () => string;
  getArrowColor: () => string;
  getBackColor: () => string;
  getGroupColor: () => string;
  getCoverColor: () => string;
  getTitleLabel: () => MediaDesc;
  getSubTitleLabel: () => MediaDesc;
  getHeightRatio: () => number;
}

export const createConfigsSlice: StateCreator<
  UseConfigsParams,
  [],
  [],
  UseConfigsParams
> = (set, get) => ({
  configs: initialConfigValues(),
  resetConfigs: () => {
    set({ configs: initialConfigValues() });
  },
  updateConfigs: (newConfig) => {
    set(({ configs }) => ({
      configs: { ...configs, ...newConfig },
    }));
    if (
      newConfig.width !== undefined ||
      newConfig.height !== undefined ||
      newConfig.fitToScreen !== undefined
    ) {
      if (newConfig.fitToScreen) {
        store.set(sizeAtom, {
          width: window.innerWidth,
          height: window.innerHeight,
        });
      } else {
        store.set(sizeAtom, {
          width: newConfig.width ?? get().configs.width,
          height: newConfig.height ?? get().configs.height,
        });
      }
    }
  },
  resetTitle: () => {
    set(({ configs }) => ({
      configs: {
        ...configs,
        title: '',
      },
    }));
  },
  getTitleLabel: () => mediaMap[get().configs.media].title,
  getSubTitleLabel: () => mediaMap[get().configs.media].subtitle,
  getHeightRatio: () => mediaMap[get().configs.media].heightRatio,
  getColor: () => colorMap[get().configs.color],
  getArrowColor: () => colorMap[get().configs.arrowColor],
  getCoverColor: () => colorMap[get().configs.coverColor],
  getGroupColor: () => colorMap[get().configs.groupColor],
  getBackColor: () => backColorMap[get().configs.backColor],
});
