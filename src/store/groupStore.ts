import { GroupCovers, PosTypes } from 'types';
import { StateCreator } from 'zustand';

export interface UseGrouspParams {
  groups: Array<GroupCovers>;
  updateAllGroupsDir: (dir: PosTypes) => void;
  updateGroupDir: (groupId: string, dir: PosTypes) => void;
  updateGroupSubDir: (groupId: string, dir: PosTypes) => void;
  updateGroupsText: (
    groupId: string,
    titleText: string,
    subtitleText: string,
  ) => void;
  addGroups: (filteredResults: Array<GroupCovers>) => void;
  updateGroupLabel: (
    groupId: string,
    coverLabel: 'title' | 'subtitle',
    label: string,
  ) => void;
  isGroup: (groupId: string) => boolean;
}

export const createGroupsSlice: StateCreator<
  UseGrouspParams,
  [],
  [],
  UseGrouspParams
> = (set, get) => ({
  groups: [],
  isGroup: (id) => !!get().groups.find((group) => group.id === id),
  updateAllGroupsDir(dir) {
    set(({ groups }) => ({
      groups: groups.map((group) => ({
        ...group,
        title: {
          ...group.title,
          dir,
        },
        subtitle: {
          ...group.subtitle,
          dir,
        },
      })),
    }));
  },
  updateGroupDir(coverId, dir) {
    set(({ groups }) => ({
      groups: groups.map((group) =>
        group.id === coverId
          ? {
              ...group,
              title: {
                ...group.title,
                dir,
              },
            }
          : group,
      ),
    }));
  },
  updateGroupSubDir(coverId, dir) {
    set(({ groups }) => ({
      groups: groups.map((group) =>
        group.id === coverId
          ? {
              ...group,
              subtitle: {
                ...group.subtitle,
                dir,
              },
            }
          : group,
      ),
    }));
  },
  updateGroupsText(coverId, titleText, subtitleText) {
    set(({ groups }) => ({
      groups: groups.map((group) =>
        coverId === group.id
          ? {
              ...group,
              title: {
                ...group.title,
                text: titleText,
              },
              subtitle: {
                ...group.subtitle,
                text: subtitleText,
              },
            }
          : group,
      ),
    }));
  },
  updateGroupLabel(coverId, groupLabel, text) {
    set(({ groups }) => ({
      groups: groups.map((group) => {
        return coverId === group.id
          ? {
              ...group,
              [groupLabel]: {
                ...group[groupLabel],
                text,
              },
            }
          : group;
      }),
    }));
  },
  addGroups(filteredResults) {
    set(({ groups }) => ({
      groups: [...groups, ...filteredResults],
    }));
  },
});
