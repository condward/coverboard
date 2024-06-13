import { Vector2d } from 'konva/lib/types';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StateCreator, create } from 'zustand';
import isDeepEqual from 'fast-deep-equal';
import { temporal } from 'zundo';
import throttle from 'just-throttle';
import { DeepPartial } from 'react-hook-form';

import { store } from 'store';

import { CoverSchema, AppSchema, GroupSchema, appSchema } from 'types';
import { DEFAULT_KEY, NAME_SPACE } from 'utils';

import {
  UseCoverParams,
  createCoversSlice,
  UseArrowsParams,
  createArrowsSlice,
  UseGrouspParams,
  createGroupsSlice,
  UseConfigsParams,
  createConfigsSlice,
  initialConfigValues,
} from './slices';
import { pointsAtom } from './atoms/utilAtoms';

const sortById = ({ id: ida }: { id: string }, { id: idb }: { id: string }) =>
  ida.localeCompare(idb);

interface CoverContextData {
  updateStoreValues: (items: AppSchema) => void;
  resetStoreValues: () => void;
  getStoreValues: () => AppSchema;
  removeCoverAndRelatedArrows: (id: string) => void;
  removeGroupAndRelatedArrows: (id: string) => void;
  updateCover: (
    coverId: CoverSchema['id'],
    partial: DeepPartial<CoverSchema>,
  ) => void;
  updateGroup: (
    groupdId: GroupSchema['id'],
    partial: DeepPartial<GroupSchema>,
  ) => void;
  updateGroupPosition: (coverId: string, { x, y }: Vector2d) => void;
  updateGroupScale: (
    coverId: string,
    scale: { scaleX: number; scaleY: number },
  ) => void;
  refreshGroups: (groupId: string) => void;
  getGroupBounds: (groupId: string) => Vector2d | undefined;
  getGroupsInsideGroup: (groupId: string) => GroupSchema[];
  getCoversInsideGroup: (coverId: string) => CoverSchema[];
  getGroupsOfCover: (coverId: string) => GroupSchema[];
  getGroupsOfGroup: (groupId: string) => GroupSchema[];
}

type MainStoreUnion = UseCoverParams &
  UseArrowsParams &
  UseConfigsParams &
  UseGrouspParams &
  CoverContextData;

const defaultValues = (): AppSchema => ({
  configs: initialConfigValues(),
  arrows: [],
  covers: [],
  groups: [],
});

const mainStoreFn: StateCreator<MainStoreUnion> = (set, get, api) => ({
  ...createConfigsSlice((value) => set(value), get, api),
  ...createArrowsSlice((value) => set(value), get, api),
  ...createCoversSlice((value) => set(value), get, api),
  ...createGroupsSlice((value) => set(value), get, api),
  getStoreValues() {
    const { configs, arrows, covers, groups } = get();
    return { configs, arrows, covers, groups };
  },
  updateStoreValues({ configs, arrows, covers, groups }) {
    set({ configs, arrows, covers, groups });
  },
  resetStoreValues() {
    set(defaultValues());
  },
  getGroupBounds(groupId) {
    const group = get().groups.find(
      (currentGroup) => currentGroup.id === groupId,
    );

    if (!group) return;

    return {
      x:
        get().configs.layout.scale * group.scale.x - get().configs.layout.scale,
      y:
        get().configs.layout.scale * get().getHeightRatio() * group.scale.y -
        get().configs.layout.scale,
    };
  },
  getCoversInsideGroup(groupId) {
    const group = get().groups.find(
      (currentGroup) => currentGroup.id === groupId,
    );

    return group
      ? get().covers.filter(
          (currentCover) =>
            currentCover.pos.x > group.pos.x &&
            currentCover.pos.x + get().configs.layout.scale <
              group.pos.x + get().configs.layout.scale * group.scale.x &&
            currentCover.pos.y > group.pos.y &&
            currentCover.pos.y +
              get().configs.layout.scale * get().getHeightRatio() <
              group.pos.y +
                get().configs.layout.scale *
                  get().getHeightRatio() *
                  group.scale.y,
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
            cover.pos.x > currentGroup.pos.x &&
            cover.pos.x + get().configs.layout.scale <
              currentGroup.pos.x +
                get().configs.layout.scale * currentGroup.scale.y &&
            cover.pos.y > currentGroup.pos.y &&
            cover.pos.y + get().configs.layout.scale * get().getHeightRatio() <
              currentGroup.pos.y +
                get().configs.layout.scale *
                  get().getHeightRatio() *
                  currentGroup.scale.y,
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
            group.pos.x > currentGroup.pos.x &&
            group.pos.x + get().configs.layout.scale <
              currentGroup.pos.x +
                get().configs.layout.scale * currentGroup.scale.x &&
            group.pos.y > currentGroup.pos.y &&
            group.pos.y + get().configs.layout.scale * get().getHeightRatio() <
              currentGroup.pos.y +
                get().configs.layout.scale *
                  get().getHeightRatio() *
                  currentGroup.scale.y,
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
            currentGroup.pos.x > group.pos.x &&
            currentGroup.pos.x +
              get().configs.layout.scale * currentGroup.scale.x <
              group.pos.x + get().configs.layout.scale * group.scale.x &&
            currentGroup.pos.y > group.pos.y &&
            currentGroup.pos.y +
              get().configs.layout.scale *
                get().getHeightRatio() *
                currentGroup.scale.y <
              group.pos.y +
                get().configs.layout.scale *
                  get().getHeightRatio() *
                  group.scale.y,
        )
      : [];
  },
  removeCoverAndRelatedArrows(coverId) {
    store.set(pointsAtom, null);

    set(({ covers, arrows }) => ({
      covers: covers.filter((c) => c.id !== coverId),
      arrows: arrows.filter(
        (l) => l.origin.id !== coverId && l.target.id !== coverId,
      ),
    }));
  },
  removeGroupAndRelatedArrows(groupId) {
    store.set(pointsAtom, null);

    const group = get().groups.find((group) => group.id === groupId);

    if (!group) return;

    const {
      getGroupsInsideGroup,
      removeGroupAndRelatedArrows,
      getCoversInsideGroup,
      removeCoverAndRelatedArrows,
    } = get();

    getGroupsInsideGroup(group.id).forEach((group) =>
      removeGroupAndRelatedArrows(group.id),
    );

    getCoversInsideGroup(group.id).forEach((cover) =>
      removeCoverAndRelatedArrows(cover.id),
    );

    set(({ arrows, groups }) => ({
      arrows: arrows.filter(
        (l) => l.origin.id !== groupId && l.target.id !== groupId,
      ),
      groups: groups.filter((c) => c.id !== groupId),
    }));
  },
  updateCover(coverId, partialCover) {
    const cover = get().covers.find((cov) => cov.id === coverId);

    if ('pos' in partialCover && partialCover.pos !== undefined && cover) {
      get()
        .getGroupsOfCover(coverId)
        .forEach((group) => get().removeConnectedArrow(coverId, group.id));
    }

    get().updateCoverSlice(coverId, partialCover);
  },
  updateGroup(groupId, partialGroup) {
    const group = get().groups.find((grp) => grp.id === groupId);

    if ('pos' in partialGroup && partialGroup.pos !== undefined && group) {
      get().updateGroupPosition(groupId, {
        x: partialGroup.pos.x ?? group.pos.x,
        y: partialGroup.pos.y ?? group.pos.y,
      });
    }

    get().updateGroupSlice(groupId, partialGroup);
  },
  refreshGroups(groupId) {
    get().updateGroup(groupId, {});

    const {
      refreshGroups,
      refreshCovers,
      getGroupsInsideGroup,
      getCoversInsideGroup,
    } = get();

    getGroupsInsideGroup(groupId).forEach((group) => refreshGroups(group.id));

    getCoversInsideGroup(groupId).forEach((covers) => refreshCovers(covers.id));
  },
  updateGroupPosition(groupId, { x, y }) {
    const group = get().groups.find((group) => group.id === groupId);

    if (!group) return;

    const {
      getCoversInsideGroup,
      updateCover,
      getGroupsInsideGroup,
      getGroupsOfGroup,
      removeConnectedArrow,
      refreshGroups,
    } = get();

    const prev = {
      x: group.pos.x,
      y: group.pos.y,
    };

    getCoversInsideGroup(group.id).forEach((cover) => {
      updateCover(cover.id, {
        pos: {
          x: cover.pos.x - (prev.x - x),
          y: cover.pos.y - (prev.y - y),
        },
      });
    });

    getGroupsInsideGroup(group.id).forEach((currentGroup) => {
      set(({ groups }) => {
        const newGroup = groups.filter((grp) => grp.id !== currentGroup.id);
        newGroup.push({
          ...currentGroup,
          pos: {
            x: currentGroup.pos.x - (prev.x - x),
            y: currentGroup.pos.y - (prev.y - y),
          },
        });

        return {
          groups: newGroup,
        };
      });
    });

    getCoversInsideGroup(group.id).forEach((cover) => {
      removeConnectedArrow(group.id, cover.id);
    });

    getGroupsInsideGroup(group.id).forEach((currentGroup) => {
      removeConnectedArrow(group.id, currentGroup.id);
    });

    getGroupsOfGroup(group.id).forEach((currentGroup) => {
      removeConnectedArrow(group.id, currentGroup.id);
    });

    refreshGroups(group.id);
  },
  updateGroupScale(groupId, scale) {
    const group = get().groups.find((group) => group.id === groupId);

    if (!group) return;

    const newPos = {
      x:
        group.pos.x -
        (get().configs.layout.scale * scale.scaleX -
          get().configs.layout.scale * group.scale.x) /
          2,
      y:
        group.pos.y -
        (get().configs.layout.scale * get().getHeightRatio() * scale.scaleY -
          get().configs.layout.scale * get().getHeightRatio() * group.scale.y) /
          2,
    };

    const filteredGroups = get().groups.filter((cov) => cov.id !== groupId);
    filteredGroups.push({
      ...group,
      scale: {
        x: scale.scaleX,
        y: scale.scaleY,
      },
      pos: {
        x: newPos.x,
        y: newPos.y,
      },
    });

    set({ groups: filteredGroups });

    const {
      getCoversInsideGroup,
      removeConnectedArrow,
      getGroupsInsideGroup,
      refreshGroups,
    } = get();

    getCoversInsideGroup(group.id).forEach((cov) =>
      removeConnectedArrow(groupId, cov.id),
    );

    getGroupsInsideGroup(group.id).forEach((group) =>
      removeConnectedArrow(groupId, group.id),
    );

    refreshGroups(group.id);
  },
});

export const useMainStore = create<MainStoreUnion>()(
  persist(
    temporal(mainStoreFn, {
      partialize: (state) => ({
        configs: state.configs,
        arrows: state.arrows,
        covers: state.covers,
        groups: state.groups,
      }),
      limit: 10,
      equality: (pastState, currentState) =>
        isDeepEqual(
          {
            configs: pastState.configs,
            arrows: pastState.arrows.toSorted(sortById),
            covers: pastState.covers.toSorted(sortById),
            groups: pastState.groups.toSorted(sortById),
          },
          {
            configs: currentState.configs,
            arrows: currentState.arrows.toSorted(sortById),
            covers: currentState.covers.toSorted(sortById),
            groups: currentState.groups.toSorted(sortById),
          },
        ),
      handleSet: (handleSet) => {
        return throttle<typeof handleSet>((state) => {
          // store.set(hideToolbarAtom, false); */
          handleSet(state);
        }, 300);
      },
    }),
    {
      name: `${NAME_SPACE}:${DEFAULT_KEY}`,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        configs: state.configs,
        arrows: state.arrows,
        covers: state.covers,
        groups: state.groups,
      }),
      onRehydrateStorage: (state) => {
        try {
          const { configs, arrows, covers, groups } = state;
          appSchema.parse({ configs, arrows, covers, groups });
        } catch (error) {
          console.error(error);
          state.resetStoreValues();
        }
      },
    },
  ),
);
