import { Covers, PosTypes, LabelTypes } from 'types';
import { StateCreator } from 'zustand';

export interface UseCoverParams {
  covers: Array<Covers>;
  updateCoverStarDir: (coverId: string, dir: PosTypes) => void;
  updateStarCount: (coverId: string, count: number) => void;
  updateAllCoversDir: (dir: PosTypes) => void;
  updateAllStarsDir: (dir: PosTypes) => void;
  refreshCovers: (coverId: string) => void;
  resetCoverLabel: (coverId: string, coverLabel: LabelTypes) => void;
  updateCoverLabel: (
    coverId: string,
    coverLabel: LabelTypes,
    label: string,
  ) => void;
  updateCoversText: (
    coverId: string,
    titleText: string,
    subTitleText: string,
  ) => void;
  addCovers: (filteredResults: Array<Covers>) => void;
  updateCoverTitleDir: (coverId: string, dir: PosTypes) => void;
  updateCoverSubtitleDir: (coverId: string, dir: PosTypes) => void;
  isCover: (coverId: string) => boolean;
}

export const createCoversSlice: StateCreator<
  UseCoverParams,
  [],
  [],
  UseCoverParams
> = (set, get) => ({
  covers: [],
  isCover: (id) => !!get().covers.find((cov) => cov.id === id),
  updateAllCoversDir(dir) {
    set(({ covers }) => ({
      covers: covers.map((cover) => ({
        ...cover,
        title: {
          ...cover.title,
          dir,
        },
        subtitle: {
          ...cover.subtitle,
          dir,
        },
      })),
    }));
  },
  updateAllStarsDir(starDir) {
    set(({ covers }) => ({
      covers: covers.map((star) => ({
        ...star,
        starDir,
      })),
    }));
  },
  updateCoverTitleDir(coverId, dir) {
    set(({ covers }) => ({
      covers: covers.map((cover) =>
        cover.id === coverId
          ? {
              ...cover,
              title: {
                ...cover.title,
                dir,
              },
            }
          : cover,
      ),
    }));
  },
  updateCoverSubtitleDir(coverId, dir) {
    set(({ covers }) => ({
      covers: covers.map((cover) =>
        cover.id === coverId
          ? {
              ...cover,
              subtitle: {
                ...cover.subtitle,
                dir,
              },
            }
          : cover,
      ),
    }));
  },
  updateCoverStarDir(coverId, dir) {
    set(({ covers }) => {
      const coverIdx = covers.findIndex((cov) => cov.id === coverId);

      if (coverIdx > -1) {
        const cover = covers[coverIdx];

        return {
          covers: covers.with(coverIdx, {
            ...cover,
            star: {
              ...cover.star,
              dir,
            },
          }),
        };
      }
      return { covers };
    });
  },
  updateStarCount(coverId, count) {
    set(({ covers }) => ({
      covers: covers.map((cover) =>
        cover.id === coverId
          ? {
              ...cover,
              star: {
                ...cover.star,
                count,
              },
            }
          : cover,
      ),
    }));
  },
  resetCoverLabel(coverId, coverLabel) {
    set(({ covers }) => ({
      covers: covers.map((cover) =>
        cover.id === coverId
          ? {
              ...cover,
              [coverLabel]: {
                ...cover[coverLabel],
                text: cover[coverLabel].search,
              },
              dir: PosTypes.BOTTOM,
            }
          : cover,
      ),
    }));
  },
  updateCoverLabel(coverId, coverLabel, text) {
    set(({ covers }) => ({
      covers: covers.map((cover) => {
        return coverId === cover.id
          ? {
              ...cover,
              [coverLabel]: {
                ...cover[coverLabel],
                text,
              },
            }
          : cover;
      }),
    }));
  },
  updateCoversText(coverId, titleText, subTitleText) {
    set(({ covers }) => ({
      covers: covers.map((cover) =>
        coverId === cover.id
          ? {
              ...cover,
              title: {
                ...cover.title,
                text: titleText,
              },
              subtitle: {
                ...cover.subtitle,
                text: subTitleText,
              },
            }
          : cover,
      ),
    }));
  },
  addCovers(filteredResults) {
    set(({ covers }) => ({
      covers: [...covers, ...filteredResults],
    }));
  },
  refreshCovers(coverId) {
    const foundCover = get().covers.find((cov) => cov.id === coverId);

    if (foundCover) {
      const filteredGroups = get().covers.filter(
        (cov) => cov.id !== foundCover.id,
      );
      filteredGroups.push(foundCover);

      set({ covers: filteredGroups });
    }
  },
});
