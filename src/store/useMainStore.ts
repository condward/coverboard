import {
  ToolbarConfigParams,
  Lines,
  Covers,
  LocalStorageData,
  schema,
  DEFAULT_KEY,
  GroupCovers,
} from 'types';
import { addPrefix } from 'utils';
import { createWithEqualityFn } from 'zustand/traditional';
import {
  UseConfigsParams,
  createConfigsSlice,
  initialConfigValues,
} from './configsStore';
import { UseCoverParams, createCoversSlice } from './coversStore';
import { UseLinesParams, createLinesSlice } from './linesStore';
import { UseGrouspParams, createGroupsSlice } from './groupStore';
import { Vector2d } from 'konva/lib/types';
import { useUtilsStore } from './useUtilsStore';

const MAX_UNDO = 10;

interface Actions {
  configs: ToolbarConfigParams;
  lines: Lines[];
  covers: Covers[];
  groups: GroupCovers[];
}

interface CoverContextData {
  actions: Array<Actions>;
  saveId: string;
  undoAction: () => void;
  setDefaultLocalStoreValues: (saveId: string) => void;
  updateStoreValues: (items: LocalStorageData) => void;
  resetStoreValues: () => void;
  getStoreValues: () => LocalStorageData;
  offLimitCovers: () => Covers[];
  offLimitGroups: () => GroupCovers[];
  removeCoverAndRelatedLines: (id: string, internal?: boolean) => void;
  removeGroupAndRelatedLines: (id: string, internal?: boolean) => void;
  updateGroupPosition: (
    coverId: string,
    { x, y }: Vector2d,
    internal?: boolean,
  ) => void;
  updateCoverPosition: (
    coverId: string,
    { x, y }: Vector2d,
    internal?: boolean,
  ) => void;
  updateGroupScale: (
    coverId: string,
    scale: { scaleX: number; scaleY: number },
  ) => void;
  refreshGroups: (groupId: string) => void;
  getGroupsInsideGroup: (groupId: string) => GroupCovers[];
  getCoversInsideGroup: (coverId: string) => Covers[];
  getGroupsOfCover: (coverId: string) => GroupCovers[];
  getGroupsOfGroup: (groupId: string) => GroupCovers[];
}

type MainStoreUnion = UseCoverParams &
  UseLinesParams &
  UseConfigsParams &
  UseGrouspParams &
  CoverContextData;

const defaultValues = () => ({
  configs: initialConfigValues(),
  lines: [],
  covers: [],
  groups: [],
});

export const useMainStore = createWithEqualityFn<MainStoreUnion>()(
  (set, get, api) => {
    const saveLastAction = (isInternal = false) => {
      if (isInternal) return;

      const { configs, lines, covers, groups } = get();

      set(({ actions }) => ({
        actions:
          actions.length < MAX_UNDO
            ? [
                ...actions,
                {
                  configs,
                  lines,
                  covers,
                  groups,
                },
              ]
            : [
                ...actions.slice(actions.length - (MAX_UNDO - 1)),
                {
                  configs,
                  lines,
                  covers,
                  groups,
                },
              ],
      }));
    };

    const saveLocalStorage = (isInternal = false) => {
      if (isInternal) return;

      const { configs, lines, covers, groups } = get();
      window.localStorage.setItem(
        addPrefix(get().saveId),
        JSON.stringify({ configs, lines, covers, groups }),
      );
    };

    const storageSet = (
      value:
        | Partial<MainStoreUnion>
        | ((value: MainStoreUnion) => Partial<MainStoreUnion>),
    ) => {
      saveLastAction();
      const save = set(value);
      saveLocalStorage();

      return save;
    };

    const storeActions = {
      setDefaultLocalStoreValues(saveId: string) {
        set({ saveId });
        try {
          const item = window.localStorage.getItem(addPrefix(saveId));

          if (item) {
            const parsedItem: LocalStorageData = JSON.parse(item);
            const parsedSchema = schema(parsedItem).parse(parsedItem);

            set({
              configs: parsedSchema.configs,
              lines: parsedSchema.lines,
              covers: parsedSchema.covers,
              groups: parsedSchema.groups,
            });
            return;
          }

          set(defaultValues());
          saveLocalStorage();
        } catch (error) {
          console.error(error);

          set({
            configs: initialConfigValues(),
            lines: [],
            covers: [],
          });
          saveLocalStorage();
        }
      },
      updateStoreValues({ configs, lines, covers, groups }: LocalStorageData) {
        storageSet({ configs, lines, covers, groups });
      },
      resetStoreValues() {
        storageSet(defaultValues());
      },
      getStoreValues() {
        const { configs, lines, covers, groups } = get();

        return { configs, lines, covers, groups };
      },
      undoAction() {
        const copyArray = [...get().actions];
        const another = copyArray.pop();

        if (another) {
          set({
            configs: another.configs,
            lines: another.lines,
            covers: another.covers,
            groups: another.groups,
            actions: copyArray,
          });
          window.localStorage.setItem(
            addPrefix(get().saveId),
            JSON.stringify({
              configs: another.configs,
              lines: another.lines,
              covers: another.covers,
              groups: another.groups,
            }),
          );
        }
      },
    };

    const getters = {
      offLimitCovers() {
        const { dragLimits, configs } = get();

        return get().covers.flatMap((covers) => {
          if (
            (covers.x > dragLimits().width &&
              dragLimits().width > configs.size) ||
            (covers.y > dragLimits().height &&
              dragLimits().height > configs.size)
          ) {
            return covers;
          }

          return [];
        });
      },
      offLimitGroups() {
        const { dragLimits, configs } = get();

        return get().groups.flatMap((group) => {
          if (
            (group.x > dragLimits().width &&
              dragLimits().width > configs.size) ||
            (group.y > dragLimits().height &&
              dragLimits().height > configs.size)
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
                currentCover.x + get().coverSizeWidth() <
                  group.x + get().coverSizeWidth() * group.scaleX &&
                currentCover.y > group.y &&
                currentCover.y + get().coverSizeHeight() <
                  group.y + get().coverSizeHeight() * group.scaleY,
            )
          : [];
      },
      getGroupsOfCover(coverId: string) {
        const cover = get().covers.find(
          (currentCover) => currentCover.id === coverId,
        );

        return cover
          ? get().groups.filter(
              (currentGroup) =>
                cover.x > currentGroup.x &&
                cover.x + get().coverSizeWidth() <
                  currentGroup.x +
                    get().coverSizeWidth() * currentGroup.scaleX &&
                cover.y > currentGroup.y &&
                cover.y + get().coverSizeHeight() <
                  currentGroup.y +
                    get().coverSizeHeight() * currentGroup.scaleY,
            )
          : [];
      },
      getGroupsOfGroup(groupId: string) {
        const group = get().groups.find(
          (currentGroup) => currentGroup.id === groupId,
        );

        return group
          ? get().groups.filter(
              (currentGroup) =>
                group.x > currentGroup.x &&
                group.x + get().coverSizeWidth() <
                  currentGroup.x +
                    get().coverSizeWidth() * currentGroup.scaleX &&
                group.y > currentGroup.y &&
                group.y + get().coverSizeHeight() <
                  currentGroup.y +
                    get().coverSizeHeight() * currentGroup.scaleY,
            )
          : [];
      },
      getGroupsInsideGroup(groupId: string) {
        const group = get().groups.find(
          (currentGroup) => currentGroup.id === groupId,
        );

        return group
          ? get().groups.filter(
              (currentGroup) =>
                currentGroup.id !== group.id &&
                currentGroup.x > group.x &&
                currentGroup.x + get().coverSizeWidth() * currentGroup.scaleX <
                  group.x + get().coverSizeWidth() * group.scaleX &&
                currentGroup.y > group.y &&
                currentGroup.y + get().coverSizeHeight() * currentGroup.scaleY <
                  group.y + get().coverSizeHeight() * group.scaleY,
            )
          : [];
      },
    };

    const setters = {
      removeCoverAndRelatedLines(coverId: string, isInternal?: boolean) {
        saveLastAction(isInternal);

        useUtilsStore.getState().setPoints(null);

        set(({ covers, lines }) => ({
          covers: covers.filter((c) => c.id !== coverId),
          lines: lines.filter(
            (l) => l.origin.id !== coverId && l.target.id !== coverId,
          ),
        }));

        saveLocalStorage(isInternal);
      },
      removeGroupAndRelatedLines(groupId: string, isInternal?: boolean) {
        saveLastAction(isInternal);

        useUtilsStore.getState().setPoints(null);

        const group = get().groups.find((group) => group.id === groupId);

        if (group) {
          const {
            getGroupsInsideGroup,
            removeGroupAndRelatedLines,
            getCoversInsideGroup,
            removeCoverAndRelatedLines,
          } = get();

          getGroupsInsideGroup(group.id).forEach((group) =>
            removeGroupAndRelatedLines(group.id, true),
          );

          getCoversInsideGroup(group.id).forEach((cover) =>
            removeCoverAndRelatedLines(cover.id, true),
          );
        }

        set(({ lines, groups }) => ({
          lines: lines.filter(
            (l) => l.origin.id !== groupId && l.target.id !== groupId,
          ),
          groups: groups.filter((c) => c.id !== groupId),
        }));

        saveLocalStorage(isInternal);
      },
      updateGroupPosition(
        groupId: string,
        { x, y }: Vector2d,
        isInternal?: boolean,
      ) {
        saveLastAction(isInternal);
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
            updateCoverPosition(
              cover.id,
              {
                x: cover.x - (prev.x - x),
                y: cover.y - (prev.y - y),
              },
              true,
            );
          });

          getGroupsInsideGroup(group.id).forEach((currentGroup) => {
            set(({ groups }) => {
              const newGroup = groups.filter(
                (grp) => grp.id !== currentGroup.id,
              );
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
              currentGroup.id !== group.id
                ? currentGroup
                : { ...currentGroup, x, y },
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

        saveLocalStorage(isInternal);
      },
      updateGroupScale(
        groupId: string,
        scale: { scaleX: number; scaleY: number },
      ) {
        saveLastAction();

        const group = get().groups.find((group) => group.id === groupId);

        if (group) {
          const newPos = {
            x:
              group.x -
              (get().coverSizeWidth() * scale.scaleX -
                get().coverSizeWidth() * group.scaleX) /
                2,
            y:
              group.y -
              (get().coverSizeHeight() * scale.scaleY -
                get().coverSizeHeight() * group.scaleY) /
                2,
          };

          const filteredGroups = get().groups.filter(
            (cov) => cov.id !== groupId,
          );
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
        saveLocalStorage();
      },
      updateCoverPosition(
        coverId: string,
        { x, y }: Vector2d,
        isInternal?: boolean,
      ) {
        saveLastAction(isInternal);

        const cover = get().covers.find((cover) => cover.id === coverId);

        if (cover) {
          const filteredCovers = get().covers.filter(
            (cov) => cov.id !== coverId,
          );
          filteredCovers.push({ ...cover, x, y });

          set({ covers: filteredCovers });

          get()
            .getGroupsOfCover(cover.id)
            .forEach((group) => get().removeConnectedLine(coverId, group.id));
        }
        saveLocalStorage(isInternal);
      },
      refreshGroups(groupId: string) {
        const group = get().groups.find((cov) => cov.id === groupId);

        if (group) {
          const filteredGroups = get().groups.filter(
            (cov) => cov.id !== group.id,
          );
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
    };

    return {
      actions: [],
      saveId: DEFAULT_KEY,
      ...createConfigsSlice((value) => storageSet(value), get, api),
      ...createLinesSlice((value) => storageSet(value), get, api),
      ...createCoversSlice((value) => storageSet(value), get, api),
      ...createGroupsSlice((value) => storageSet(value), get, api),
      ...getters,
      ...storeActions,
      ...setters,
    };
  },
  Object.is,
);
