import { Vector2d } from 'konva/lib/types';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StateCreator, create } from 'zustand';
import isDeepEqual from 'fast-deep-equal';
import { temporal } from 'zundo';
import throttle from 'just-throttle';

import { store } from 'store';

import { CoverSchema, AppSchema, GroupSchema, appSchema } from 'types';
import { DEFAULT_KEY, NAME_SPACE } from 'utils';

import {
  UseConfigsParams,
  createConfigsSlice,
  initialConfigValues,
} from './configsStore';
import { UseCoverParams, createCoversSlice } from './coversStore';
import { UseLinesParams, createLinesSlice } from './linesStore';
import { UseGrouspParams, createGroupsSlice } from './groupStore';
import { pointsAtom } from './utilAtoms';

const sortById = ({ id: ida }: { id: string }, { id: idb }: { id: string }) =>
  ida.localeCompare(idb);

interface CoverContextData {
  updateStoreValues: (items: AppSchema) => void;
  resetStoreValues: () => void;
  getStoreValues: () => AppSchema;
  offLimitCovers: () => CoverSchema[];
  offLimitGroups: () => GroupSchema[];
  removeCoverAndRelatedLines: (id: string) => void;
  removeGroupAndRelatedLines: (id: string) => void;
  updateGroupPosition: (coverId: string, { x, y }: Vector2d) => void;
  updateCoverPosition: (coverId: string, { x, y }: Vector2d) => void;
  updateGroupScale: (
    coverId: string,
    scale: { scaleX: number; scaleY: number },
  ) => void;
  refreshGroups: (groupId: string) => void;
  getGroupsInsideGroup: (groupId: string) => GroupSchema[];
  getCoversInsideGroup: (coverId: string) => CoverSchema[];
  getGroupsOfCover: (coverId: string) => GroupSchema[];
  getGroupsOfGroup: (groupId: string) => GroupSchema[];
}

type MainStoreUnion = UseCoverParams &
  UseLinesParams &
  UseConfigsParams &
  UseGrouspParams &
  CoverContextData;

const defaultValues = (): AppSchema => ({
  configs: initialConfigValues(),
  lines: [],
  covers: [],
  groups: [],
});

const mainStoreFn: StateCreator<MainStoreUnion> = (set, get, api) => ({
  ...createConfigsSlice((value) => set(value), get, api),
  ...createLinesSlice((value) => set(value), get, api),
  ...createCoversSlice((value) => set(value), get, api),
  ...createGroupsSlice((value) => set(value), get, api),
  updateCoverPosition(coverId, { x, y }) {
    const cover = get().covers.find((cover) => cover.id === coverId);

    if (cover) {
      const filteredCovers = get().covers.filter((cov) => cov.id !== coverId);
      filteredCovers.push({ ...cover, x, y });

      set({ covers: filteredCovers });

      get()
        .getGroupsOfCover(cover.id)
        .forEach((group) => get().removeConnectedLine(coverId, group.id));
    }
  },
  refreshGroups(groupId) {
    const group = get().groups.find((cov) => cov.id === groupId);

    if (group) {
      const filteredGroups = get().groups.filter((cov) => cov.id !== group.id);
      filteredGroups.push(group);

      set({ groups: filteredGroups });

      const {
        refreshGroups,
        refreshCovers,
        getGroupsInsideGroup,
        getCoversInsideGroup,
      } = get();

      getGroupsInsideGroup(group.id).forEach((group) =>
        refreshGroups(group.id),
      );

      getCoversInsideGroup(group.id).forEach((covers) =>
        refreshCovers(covers.id),
      );
    }
  },
  updateStoreValues({ configs, lines, covers, groups }) {
    set({ configs, lines, covers, groups });
  },
  resetStoreValues() {
    set(defaultValues());
  },
  getStoreValues() {
    const { configs, lines, covers, groups } = get();
    return { configs, lines, covers, groups };
  },
  offLimitCovers() {
    const { getDragLimits, configs } = get();
    const dragLimits = getDragLimits();

    return get().covers.flatMap((covers) => {
      if (
        (covers.x > dragLimits.width && dragLimits.width > configs.size) ||
        (covers.y > dragLimits.height && dragLimits.height > configs.size)
      ) {
        return covers;
      }

      return [];
    });
  },
  offLimitGroups() {
    const { getDragLimits, configs } = get();
    const dragLimits = getDragLimits();

    return get().groups.flatMap((group) => {
      if (
        (group.x > dragLimits.width && dragLimits.width > configs.size) ||
        (group.y > dragLimits.height && dragLimits.height > configs.size)
      ) {
        return group;
      }

      return [];
    });
  },
  getCoversInsideGroup(groupId: string) {
    const group = get().groups.find(
      (currentGroup) => currentGroup.id === groupId,
    );

    return group
      ? get().covers.filter(
          (currentCover) =>
            currentCover.x > group.x &&
            currentCover.x + get().getCoverSizeWidth() <
              group.x + get().getCoverSizeWidth() * group.scaleX &&
            currentCover.y > group.y &&
            currentCover.y + get().getCoverSizeHeight() <
              group.y + get().getCoverSizeHeight() * group.scaleY,
        )
      : [];
  },
  getGroupsOfCover(coverId) {
    const cover = get().covers.find(
      (currentCover) => currentCover.id === coverId,
    );

    return cover
      ? get().groups.filter(
          (currentGroup) =>
            cover.x > currentGroup.x &&
            cover.x + get().getCoverSizeWidth() <
              currentGroup.x +
                get().getCoverSizeWidth() * currentGroup.scaleX &&
            cover.y > currentGroup.y &&
            cover.y + get().getCoverSizeHeight() <
              currentGroup.y + get().getCoverSizeHeight() * currentGroup.scaleY,
        )
      : [];
  },
  getGroupsOfGroup(groupId) {
    const group = get().groups.find(
      (currentGroup) => currentGroup.id === groupId,
    );

    return group
      ? get().groups.filter(
          (currentGroup) =>
            group.x > currentGroup.x &&
            group.x + get().getCoverSizeWidth() <
              currentGroup.x +
                get().getCoverSizeWidth() * currentGroup.scaleX &&
            group.y > currentGroup.y &&
            group.y + get().getCoverSizeHeight() <
              currentGroup.y + get().getCoverSizeHeight() * currentGroup.scaleY,
        )
      : [];
  },
  getGroupsInsideGroup(groupId) {
    const group = get().groups.find(
      (currentGroup) => currentGroup.id === groupId,
    );

    return group
      ? get().groups.filter(
          (currentGroup) =>
            currentGroup.id !== group.id &&
            currentGroup.x > group.x &&
            currentGroup.x + get().getCoverSizeWidth() * currentGroup.scaleX <
              group.x + get().getCoverSizeWidth() * group.scaleX &&
            currentGroup.y > group.y &&
            currentGroup.y + get().getCoverSizeHeight() * currentGroup.scaleY <
              group.y + get().getCoverSizeHeight() * group.scaleY,
        )
      : [];
  },
  removeCoverAndRelatedLines(coverId) {
    store.set(pointsAtom, null);

    set(({ covers, lines }) => ({
      covers: covers.filter((c) => c.id !== coverId),
      lines: lines.filter(
        (l) => l.origin.id !== coverId && l.target.id !== coverId,
      ),
    }));
  },
  removeGroupAndRelatedLines(groupId) {
    store.set(pointsAtom, null);

    const group = get().groups.find((group) => group.id === groupId);

    if (group) {
      const {
        getGroupsInsideGroup,
        removeGroupAndRelatedLines,
        getCoversInsideGroup,
        removeCoverAndRelatedLines,
      } = get();

      getGroupsInsideGroup(group.id).forEach((group) =>
        removeGroupAndRelatedLines(group.id),
      );

      getCoversInsideGroup(group.id).forEach((cover) =>
        removeCoverAndRelatedLines(cover.id),
      );
    }

    set(({ lines, groups }) => ({
      lines: lines.filter(
        (l) => l.origin.id !== groupId && l.target.id !== groupId,
      ),
      groups: groups.filter((c) => c.id !== groupId),
    }));
  },
  updateGroupPosition(groupId, { x, y }) {
    const group = get().groups.find((group) => group.id === groupId);

    if (group) {
      const {
        getCoversInsideGroup,
        updateCoverPosition,
        getGroupsInsideGroup,
        getGroupsOfGroup,
        removeConnectedLine,
        refreshGroups,
      } = get();

      const prev = {
        x: group.x,
        y: group.y,
      };

      getCoversInsideGroup(group.id).forEach((cover) => {
        updateCoverPosition(cover.id, {
          x: cover.x - (prev.x - x),
          y: cover.y - (prev.y - y),
        });
      });

      getGroupsInsideGroup(group.id).forEach((currentGroup) => {
        set(({ groups }) => {
          const newGroup = groups.filter((grp) => grp.id !== currentGroup.id);
          newGroup.push({
            ...currentGroup,
            x: currentGroup.x - (prev.x - x),
            y: currentGroup.y - (prev.y - y),
          });

          return {
            groups: newGroup,
          };
        });
      });

      set(({ groups }) => ({
        groups: groups.map((currentGroup) =>
          currentGroup.id === group.id
            ? { ...currentGroup, x, y }
            : currentGroup,
        ),
      }));

      getCoversInsideGroup(group.id).forEach((cover) => {
        removeConnectedLine(group.id, cover.id);
      });

      getGroupsInsideGroup(group.id).forEach((currentGroup) => {
        removeConnectedLine(group.id, currentGroup.id);
      });

      getGroupsOfGroup(group.id).forEach((currentGroup) => {
        removeConnectedLine(group.id, currentGroup.id);
      });

      refreshGroups(group.id);
    }
  },
  updateGroupScale(groupId, scale) {
    const group = get().groups.find((group) => group.id === groupId);

    if (group) {
      const newPos = {
        x:
          group.x -
          (get().getCoverSizeWidth() * scale.scaleX -
            get().getCoverSizeWidth() * group.scaleX) /
            2,
        y:
          group.y -
          (get().getCoverSizeHeight() * scale.scaleY -
            get().getCoverSizeHeight() * group.scaleY) /
            2,
      };

      const filteredGroups = get().groups.filter((cov) => cov.id !== groupId);
      filteredGroups.push({
        ...group,
        scaleX: scale.scaleX,
        scaleY: scale.scaleY,
        x: newPos.x,
        y: newPos.y,
      });

      set({ groups: filteredGroups });

      const {
        getCoversInsideGroup,
        removeConnectedLine,
        getGroupsInsideGroup,
        refreshGroups,
      } = get();

      getCoversInsideGroup(group.id).forEach((cov) =>
        removeConnectedLine(groupId, cov.id),
      );

      getGroupsInsideGroup(group.id).forEach((group) =>
        removeConnectedLine(groupId, group.id),
      );

      refreshGroups(group.id);
    }
  },
});

export const useMainStore = create<MainStoreUnion>()(
  persist(
    temporal(mainStoreFn, {
      partialize: (state) => ({
        configs: state.configs,
        lines: state.lines,
        covers: state.covers,
        groups: state.groups,
      }),
      limit: 10,
      equality: (pastState, currentState) =>
        isDeepEqual(
          {
            configs: pastState.configs,
            lines: pastState.lines.toSorted(sortById),
            covers: pastState.covers.toSorted(sortById),
            groups: pastState.groups.toSorted(sortById),
          },
          {
            configs: currentState.configs,
            lines: currentState.lines.toSorted(sortById),
            covers: currentState.covers.toSorted(sortById),
            groups: currentState.groups.toSorted(sortById),
          },
        ),
      handleSet: (handleSet) =>
        throttle<typeof handleSet>((state) => {
          handleSet(state);
        }, 300),
    }),
    {
      name: `${NAME_SPACE}:${DEFAULT_KEY}`,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        configs: state.configs,
        lines: state.lines,
        covers: state.covers,
        groups: state.groups,
      }),
      onRehydrateStorage: (state) => {
        try {
          const { configs, lines, covers, groups } = state;
          appSchema.parse({ configs, lines, covers, groups });
        } catch (error) {
          console.error(error);
          state.resetStoreValues();
        }
      },
    },
  ),
);
