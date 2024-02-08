import {
  Colors,
  BackColors,
  PosTypes,
  ToolbarConfigParams,
  ToolConfigIDs,
  DragLimits,
  colorMap,
  backColorMap,
} from 'types';
import { Media, MediaDesc, MediaMap } from 'types/configTypes';
import { StateCreator } from 'zustand';

const getSize = () => {
  const size = Math.min(150, Math.max(70, window.innerWidth / 20));
  return Math.ceil(size / 10) * 10;
};
export const initialConfigValues = (): ToolbarConfigParams => ({
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
  configs: ToolbarConfigParams;
  resetConfigs: () => void;
  updateConfigs: (newConfig: ToolbarConfigParams) => void;
  resetTitle: () => void;
  updateTitle: (title: string) => void;
  coverSizeWidth: () => number;
  coverSizeHeight: () => number;
  toobarIconSize: () => number;
  fontSize: () => number;
  circleRadius: () => number;
  starRadius: () => number;
  getCurrentY: (index: number) => number;
  dragLimits: () => DragLimits;
  toolBarLimits: () => DragLimits;
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
  titleLabel: () => MediaDesc;
  subTitleLabel: () => MediaDesc;
  setMedia: (media: Media) => void;
}

export const createConfigsSlice: StateCreator<
  UseConfigsParams,
  [],
  [],
  UseConfigsParams
> = (set, get) => ({
  configs: initialConfigValues(),
  coverSizeWidth: () => get().configs.size,
  coverSizeHeight: () =>
    get().configs.size * MediaMap[get().configs.media].heightRatio,
  setMedia: (media: Media) => {
    set(({ configs }) => ({
      configs: { ...configs, media },
    }));
  },
  getShowStars: () => get().configs.showStars,
  titleLabel: () => MediaMap[get().configs.media].title,
  subTitleLabel: () => MediaMap[get().configs.media].subtitle,
  getColor: () => colorMap[get().configs.color],
  getArrowColor: () => colorMap[get().configs.arrowColor],
  getCoverColor: () => colorMap[get().configs.coverColor],
  getGroupColor: () => colorMap[get().configs.groupColor],
  getBackColor: () => backColorMap[get().configs.backColor],
  windowSize: {
    width: window.innerWidth,
    height: window.innerHeight,
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
  toobarIconSize: () => get().configs.size / 2.5,
  fontSize: () => get().configs.size / 7,
  circleRadius: () => get().configs.size / 7 / 1.5,
  starRadius: () => get().circleRadius() * 0.8,
  dragLimits: () => ({
    x: 2.5 * get().toobarIconSize(),
    y: 0,
    width: window.innerWidth - 3.5 * get().toobarIconSize(),
    height: window.innerHeight - 1 * get().toobarIconSize(),
  }),
  getCurrentY: (index: number) =>
    0 + index * (get().toobarIconSize() + get().toobarIconSize() / 2),
  toolBarLimits: () => ({
    x: 0,
    y: 0,
    width: get().toobarIconSize() * 2,
    height:
      get().getCurrentY(Object.keys(ToolConfigIDs).length - 1) +
      2 * get().toobarIconSize(),
  }),
});
