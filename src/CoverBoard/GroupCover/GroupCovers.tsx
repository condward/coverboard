import { FC } from 'react';

import { useShallowMainStore } from 'store';

import { GroupCover } from './GroupCover';

export const GroupCovers: FC = () => {
  const groupsIds = useShallowMainStore((state) =>
    state.groups.map((group) => group.id),
  );

  return (
    <>
      {groupsIds.map((id, index) => (
        <GroupCover key={id} index={index} />
      ))}
    </>
  );
};
