import { StateCreator } from 'zustand';
import { DeepPartial } from 'react-hook-form';

import { GroupSchema, GroupsSchema, PosTypes, groupsSchema } from 'types';

export interface UseGrouspParams {
  groups: GroupsSchema;
  isGroup: (groupId: GroupSchema['id']) => boolean;
  updateGroup: (
    groupdId: GroupSchema['id'],
    partial: DeepPartial<GroupSchema>,
  ) => void;
  updateAllGroupsDir: (dir: PosTypes) => void;
  addGroups: (filteredResults: GroupsSchema) => void;
}

export const createGroupsSlice: StateCreator<
  UseGrouspParams,
  [],
  [],
  UseGrouspParams
> = (set, get) => ({
  groups: [],
  isGroup: (id) => get().groups.some((group) => group.id === id),
  updateGroup(groupId, partialGroup) {
    set(({ groups }) => {
      const groupIdx = groups.findIndex((grp) => grp.id === groupId);

      if (groupIdx) {
        const groupCopy = [...groups];
        const group = groupCopy[groupIdx];

        groupCopy[groupIdx] = {
          ...group,
          ...partialGroup,
          title: { ...group.title, ...partialGroup.title },
          subtitle: { ...group.subtitle, ...partialGroup.subtitle },
        };

        return { groups: groupCopy };
      }
      return { groups };
    });
  },
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
  addGroups(filteredResults) {
    set(({ groups }) => ({
      groups: groupsSchema.parse([...groups, ...filteredResults]),
    }));
  },
});
