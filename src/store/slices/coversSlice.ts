import { StateCreator } from 'zustand';
import { DeepPartial } from 'react-hook-form';

import { CoverSchema, CoversSchema, PosTypes, coversSchema } from 'types';

export interface UseCoverParams {
  covers: CoversSchema;
  isCover: (coverId: CoverSchema['id']) => boolean;
  updateCover: (
    coverId: CoverSchema['id'],
    partial: DeepPartial<CoverSchema>,
  ) => void;
  updateAllCoversDir: (dir: PosTypes) => void;
  updateAllStarsDir: (dir: PosTypes) => void;
  refreshCovers: (coverId: CoverSchema['id']) => void;
  resetCoverLabels: (coverId: CoverSchema['id']) => void;
  addCovers: (filteredResults: CoversSchema) => void;
}

export const createCoversSlice: StateCreator<
  UseCoverParams,
  [],
  [],
  UseCoverParams
> = (set, get) => ({
  covers: [],
  isCover: (id) => get().covers.some((cov) => cov.id === id),
  updateCover(coverId, partialCover) {
    set(({ covers }) => {
      const coverIdx = covers.findIndex((cov) => cov.id === coverId);

      if (coverIdx > -1) {
        const coverCopy = [...covers];
        const cover = coverCopy[coverIdx];

        coverCopy[coverIdx] = {
          ...cover,
          ...partialCover,
          star: { ...cover.star, ...partialCover.star },
          title: { ...cover.title, ...partialCover.title },
          subtitle: { ...cover.subtitle, ...partialCover.subtitle },
        };

        return { covers: coverCopy };
      }
      return { covers };
    });
  },
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
  resetCoverLabels(coverId) {
    set(({ covers }) => ({
      covers: covers.map((cover) =>
        cover.id === coverId
          ? {
              ...cover,
              title: {
                ...cover.title,
                text: cover.title.search,
              },
              subtitle: {
                ...cover.subtitle,
                text: cover.subtitle.search,
              },
              dir: PosTypes.BOTTOM,
            }
          : cover,
      ),
    }));
  },
  addCovers(filteredResults) {
    set(({ covers }) => ({
      covers: coversSchema.parse([...covers, ...filteredResults]),
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
