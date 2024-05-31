import { StateCreator } from 'zustand';

import {
  Colors,
  BackColors,
  PosTypes,
  ConfigSchema,
  ToolConfigIDs,
  DragLimits,
  colorMap,
  backColorMap,
  Media,
  MediaDesc,
  MediaMap,
} from 'types';

const getSize = () => {
  const size = Math.min(150, Math.max(70, window.innerWidth / 20));
  return Math.ceil(size / 10) * 10;
};
export const initialConfigValues = (): ConfigSchema => ({
  size: getSize(),
  title: '',
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
  updateConfigs: (newConfig: ConfigSchema) => void;
  resetTitle: () => void;
  updateTitle: (title: string) => void;
  getCoverSizeWidth: () => number;
  getCoverSizeHeight: () => number;
  getToobarIconSize: () => number;
  getFontSize: () => number;
  getCircleRadius: () => number;
  getStarRadius: () => number;
  getCurrentY: (index: number) => number;
  getDragLimits: () => DragLimits;
  getToolBarLimits: () => DragLimits;
  setWindowSize: () => void;
  getColor: () => string;
  getArrowColor: () => string;
  getBackColor: () => string;
  getGroupColor: () => string;
  getCoverColor: () => string;
  getShowStars: () => boolean;
  windowSize: {
    width: number;
    height: number;
  };
  getTitleLabel: () => MediaDesc;
  getSubTitleLabel: () => MediaDesc;
  setMedia: (media: Media) => void;
}

export const createConfigsSlice: StateCreator<
  UseConfigsParams,
  [],
  [],
  UseConfigsParams
> = (set, get) => ({
  configs: initialConfigValues(),
  windowSize: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  setMedia: (media: Media) => {
    set(({ configs }) => ({
      configs: { ...configs, media },
    }));
  },
  setWindowSize: () => {
    set({
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  },
  resetConfigs: () => {
    set({ configs: initialConfigValues() });
  },
  updateConfigs: (newConfig) => {
    set({
      configs: { ...newConfig },
    });
  },
  resetTitle: () => {
    set(({ configs }) => ({
      configs: {
        ...configs,
        title: '',
      },
    }));
  },
  updateTitle: (title) => {
    set(({ configs }) => ({
      configs: { ...configs, title },
    }));
  },
  getCoverSizeWidth: () => get().configs.size,
  getCoverSizeHeight: () =>
    get().configs.size * MediaMap[get().configs.media].heightRatio,
  getShowStars: () => get().configs.showStars,
  getTitleLabel: () => MediaMap[get().configs.media].title,
  getSubTitleLabel: () => MediaMap[get().configs.media].subtitle,
  getColor: () => colorMap[get().configs.color],
  getArrowColor: () => colorMap[get().configs.arrowColor],
  getCoverColor: () => colorMap[get().configs.coverColor],
  getGroupColor: () => colorMap[get().configs.groupColor],
  getBackColor: () => backColorMap[get().configs.backColor],
  getToobarIconSize: () => get().configs.size / 2.5,
  getFontSize: () => get().configs.size / 7,
  getCircleRadius: () => get().configs.size / 7 / 1.5,
  getStarRadius: () => get().getCircleRadius() * 0.8,
  getDragLimits: () => ({
    x: 2.5 * get().getToobarIconSize(),
    y: 0,
    width: get().windowSize.width - 3.5 * get().getToobarIconSize(),
    height: get().windowSize.height - 1 * get().getToobarIconSize(),
  }),
  getCurrentY: (index: number) =>
    0 + index * (get().getToobarIconSize() + get().getToobarIconSize() / 2),
  getToolBarLimits: () => ({
    x: 0,
    y: 0,
    width: get().getToobarIconSize() * 2,
    height:
      get().getCurrentY(Object.keys(ToolConfigIDs).length - 1) +
      2 * get().getToobarIconSize(),
  }),
});
