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
    helpers: true,
    color: Colors.YELLOW,
    backColor: BackColors.DARK,
  },
  title: {
    text: '',
    show: true,
  },
  covers: {
    color: Colors.ORANGE,
    title: {
      show: true,
      dir: PosTypes.BOTTOM,
    },
    subtitle: {
      show: true,
      dir: PosTypes.BOTTOM,
    },
    rating: {
      show: true,
      dir: PosTypes.BOTTOM,
    },
  },
  groups: {
    color: Colors.GREEN,
    backColor: BackColors.DARK,
    title: {
      show: true,
      dir: PosTypes.BOTTOM,
    },
    subtitle: {
      show: true,
      dir: PosTypes.BOTTOM,
    },
  },
  arrows: {
    color: Colors.YELLOW,
    title: {
      show: true,
      dir: PosTypes.BOTTOM,
    },
    circle: {
      show: true,
    },
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
  updateConfigs: ({ media, title, layout, covers, groups, arrows }) => {
    set(({ configs }) => ({
      configs: {
        media: media ?? configs.media,
        layout: {
          scale: layout?.scale ?? configs.layout.scale,
          fitToScreen: layout?.fitToScreen ?? configs.layout.fitToScreen,
          width: layout?.width ?? configs.layout.width,
          height: layout?.height ?? configs.layout.height,
          color: layout?.color ?? configs.layout.color,
          backColor: layout?.backColor ?? configs.layout.backColor,
          helpers: layout?.helpers ?? configs.layout.helpers,
        },
        title: {
          text: title?.text ?? configs.title.text,
          show: title?.show ?? configs.title.show,
        },
        covers: {
          color: covers?.color ?? configs.covers.color,
          title: {
            show: covers?.title?.show ?? configs.covers.title.show,
            dir: covers?.title?.dir ?? configs.covers.title.dir,
          },
          subtitle: {
            show: covers?.subtitle?.show ?? configs.covers.subtitle.show,
            dir: covers?.subtitle?.dir ?? configs.covers.subtitle.dir,
          },
          rating: {
            show: covers?.rating?.show ?? configs.covers.rating.show,
            dir: covers?.rating?.dir ?? configs.covers.rating.dir,
          },
        },
        groups: {
          title: {
            show: groups?.title?.show ?? configs.groups.title.show,
            dir: groups?.title?.dir ?? configs.groups.title.dir,
          },
          subtitle: {
            show: groups?.subtitle?.show ?? configs.groups.subtitle.show,
            dir: groups?.subtitle?.dir ?? configs.groups.subtitle.dir,
          },
          color: groups?.color ?? configs.groups.color,
          backColor: groups?.backColor ?? configs.groups.backColor,
        },
        arrows: {
          color: arrows?.color ?? configs.arrows.color,
          title: {
            show: arrows?.title?.show ?? configs.arrows.title.show,
            dir: arrows?.title?.dir ?? configs.arrows.title.dir,
          },
          circle: {
            show: arrows?.circle?.show ?? configs.arrows.circle.show,
          },
        },
      },
    }));

    if (layout !== undefined) {
      if (
        layout.width !== undefined ||
        layout.height !== undefined ||
        layout.fitToScreen !== undefined
      ) {
        if (layout.fitToScreen) {
          store.set(sizeAtom, {
            width: window.innerWidth,
            height: window.innerHeight,
          });
        } else {
          store.set(sizeAtom, {
            width: layout.width ?? get().configs.layout.width,
            height: layout.height ?? get().configs.layout.height,
          });
        }
      }
    }
  },
  getTitleLabel: () => mediaMap[get().configs.media].title,
  getSubTitleLabel: () => mediaMap[get().configs.media].subtitle,
  getHeightRatio: () => mediaMap[get().configs.media].heightRatio,
  getColor: () => colorMap[get().configs.layout.color],
  getArrowColor: () => colorMap[get().configs.arrows.color],
  getCoverColor: () => colorMap[get().configs.covers.color],
  getGroupColor: () => colorMap[get().configs.groups.color],
  getBackColor: () => backColorMap[get().configs.groups.backColor],
  getGroupBackColor: () => backColorMap[get().configs.layout.backColor],
});
