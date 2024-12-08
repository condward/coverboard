import { StateCreator } from 'zustand';
import type { DeepPartial } from 'react-hook-form';

import { GroupSchema, GroupsSchema, groupsSchema } from 'types';

export interface UseGrouspParams {
  groups: GroupsSchema;
  isGroup: (groupId: GroupSchema['id']) => boolean;
  updateGroupSlice: (
    groupdId: GroupSchema['id'],
    partial: DeepPartial<GroupSchema>,
  ) => void;
  updateAllGroups: (group: DeepPartial<GroupSchema>) => void;
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
  updateGroupSlice(groupId, partialGroup) {
    set(({ groups }) => {
      const group = groups.find((grp) => grp.id === groupId);

      if (!group) return { groups };

      const groupCopy = groups.filter((grp) => grp.id !== groupId);
      groupCopy.push({
        id: partialGroup.id ?? group.id,
        pos: {
          x: partialGroup.pos?.x ?? group.pos.x,
          y: partialGroup.pos?.y ?? group.pos.y,
        },
        scale: {
          x: partialGroup.scale?.x ?? group.scale.x,
          y: partialGroup.scale?.y ?? group.scale.y,
        },
        title: {
          dir: partialGroup.title?.dir ?? group.title.dir,
          text: partialGroup.title?.text ?? group.title.text,
        },
        subtitle: {
          dir: partialGroup.subtitle?.dir ?? group.subtitle.dir,
          text: partialGroup.subtitle?.text ?? group.subtitle.text,
        },
      });

      return { groups: groupCopy };
    });
  },
  updateAllGroups(groupDir) {
    get().groups.forEach((group) => get().updateGroupSlice(group.id, groupDir));
  },
  addGroups(filteredResults) {
    set(({ groups }) => ({
      groups: groupsSchema.parse([...groups, ...filteredResults]),
    }));
  },
});
