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

      if (groupIdx > -1) {
        const groupCopy = [...groups];
        const group = groupCopy[groupIdx];

        groupCopy[groupIdx] = {
          ...group,
          ...partialGroup,
          title: { ...group.title, ...partialGroup.title },
          subtitle: { ...group.subtitle, ...partialGroup.subtitle },
        };

        groupCopy[groupIdx] = {
          id: partialGroup.id ?? group.id,
          x: partialGroup.x ?? group.x,
          y: partialGroup.y ?? group.y,
          scaleX: partialGroup.scaleX ?? group.scaleX,
          scaleY: partialGroup.scaleY ?? group.scaleY,
          title: {
            dir: partialGroup.title?.dir ?? group.title.dir,
            text: partialGroup.title?.text ?? group.title.text,
          },
          subtitle: {
            dir: partialGroup.subtitle?.dir ?? group.subtitle.dir,
            text: partialGroup.subtitle?.text ?? group.subtitle.text,
          },
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
