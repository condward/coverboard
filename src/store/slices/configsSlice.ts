import { StateCreator } from 'zustand';
import { DeepPartial } from 'react-hook-form';

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

export const initialConfigValues = (): ConfigSchema => ({
  media: Media.MUSIC,
  layout: {
    scale:
      Math.ceil(Math.min(150, Math.max(70, window.innerWidth / 20)) / 10) * 10,
    width: 500,
    height: 500,
    fitToScreen: true,
    title: '',
  },
  colors: {
    main: Colors.YELLOW,
    arrows: Colors.YELLOW,
    covers: Colors.ORANGE,
    groups: Colors.GREEN,
    mainBack: BackColors.DARK,
    groupsBack: BackColors.DARK,
  },
  visibility: {
    titles: true,
    subtitles: true,
    arrows: true,
    mainTitle: true,
    stars: true,
    helpers: true,
  },
  dir: {
    covers: PosTypes.BOTTOM,
    stars: PosTypes.BOTTOM,
    groups: PosTypes.TOP,
  },
});

export interface UseConfigsParams {
  configs: ConfigSchema;
  resetConfigs: () => void;
  updateConfigs: (newConfig: DeepPartial<ConfigSchema>) => void;
  getColor: () => string;
  getArrowColor: () => string;
  getBackColor: () => string;
  getGroupBackColor: () => string;
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
      configs: {
        media: newConfig.media ?? configs.media,
        layout: {
          title: newConfig.layout?.title ?? configs.layout.title,
          scale: newConfig.layout?.scale ?? configs.layout.scale,
          fitToScreen:
            newConfig.layout?.fitToScreen ?? configs.layout.fitToScreen,
          width: newConfig.layout?.width ?? configs.layout.width,
          height: newConfig.layout?.height ?? configs.layout.height,
        },
        colors: {
          main: newConfig.colors?.main ?? configs.colors.main,
          arrows: newConfig.colors?.arrows ?? configs.colors.arrows,
          covers: newConfig.colors?.covers ?? configs.colors.covers,
          groups: newConfig.colors?.groups ?? configs.colors.groups,
          mainBack: newConfig.colors?.mainBack ?? configs.colors.mainBack,
          groupsBack: newConfig.colors?.groupsBack ?? configs.colors.groupsBack,
        },
        visibility: {
          titles: newConfig.visibility?.titles ?? configs.visibility.titles,
          arrows: newConfig.visibility?.arrows ?? configs.visibility.arrows,
          subtitles:
            newConfig.visibility?.subtitles ?? configs.visibility.subtitles,
          mainTitle:
            newConfig.visibility?.mainTitle ?? configs.visibility.mainTitle,
          stars: newConfig.visibility?.stars ?? configs.visibility.stars,
          helpers: newConfig.visibility?.helpers ?? configs.visibility.helpers,
        },
        dir: {
          covers: newConfig.dir?.covers ?? configs.dir.covers,
          stars: newConfig.dir?.stars ?? configs.dir.stars,
          groups: newConfig.dir?.groups ?? configs.dir.groups,
        },
      },
    }));

    if ('layout' in newConfig && newConfig.layout !== undefined) {
      if (
        newConfig.layout.width !== undefined ||
        newConfig.layout.height !== undefined ||
        newConfig.layout.fitToScreen !== undefined
      ) {
        if (newConfig.layout.fitToScreen) {
          store.set(sizeAtom, {
            width: window.innerWidth,
            height: window.innerHeight,
          });
        } else {
          store.set(sizeAtom, {
            width: newConfig.layout.width ?? get().configs.layout.width,
            height: newConfig.layout.height ?? get().configs.layout.height,
          });
        }
      }
    }
  },
  getTitleLabel: () => mediaMap[get().configs.media].title,
  getSubTitleLabel: () => mediaMap[get().configs.media].subtitle,
  getHeightRatio: () => mediaMap[get().configs.media].heightRatio,
  getColor: () => colorMap[get().configs.colors.main],
  getArrowColor: () => colorMap[get().configs.colors.arrows],
  getCoverColor: () => colorMap[get().configs.colors.covers],
  getGroupColor: () => colorMap[get().configs.colors.groups],
  getBackColor: () => backColorMap[get().configs.colors.mainBack],
  getGroupBackColor: () => backColorMap[get().configs.colors.groupsBack],
});
