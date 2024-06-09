import { StateCreator } from 'zustand';
import { DeepPartial } from 'react-hook-form';

import { CoverSchema, CoversSchema, PosTypes, coversSchema } from 'types';

export interface UseCoverParams {
  covers: CoversSchema;
  isCover: (coverId: CoverSchema['id']) => boolean;
  updateCoverSlice: (
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
  updateCoverSlice(coverId, partialCover) {
    set(({ covers }) => {
      const cover = covers.find((cov) => cov.id === coverId);

      if (!cover) return { covers };

      const coverCopy = covers.filter((cov) => cov.id !== coverId);
      coverCopy.push({
        id: partialCover.id ?? cover.id,
        pos: {
          x: partialCover.pos?.x ?? cover.pos.x,
          y: partialCover.pos?.y ?? cover.pos.y,
        },
        link: partialCover.link ?? cover.link,
        star: {
          dir: partialCover.star?.dir ?? cover.star.dir,
          count: partialCover.star?.count ?? cover.star.count,
        },
        title: {
          dir: partialCover.title?.dir ?? cover.title.dir,
          text: partialCover.title?.text ?? cover.title.text,
          search: partialCover.title?.search ?? cover.title.search,
        },
        subtitle: {
          dir: partialCover.subtitle?.dir ?? cover.subtitle.dir,
          text: partialCover.subtitle?.text ?? cover.subtitle.text,
          search: partialCover.subtitle?.search ?? cover.subtitle.search,
        },
      });

      return { covers: coverCopy };
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
