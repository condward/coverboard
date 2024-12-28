import { FC } from 'react';

import { useMainStore } from 'store';

import { GroupCover } from './GroupCover';

export const GroupCovers: FC = () => {
  const groupsIds = useMainStore((state) =>
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
