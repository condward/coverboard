import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useMainStore } from 'store';

import { GroupCover } from './GroupCover';

export const GroupCovers: FC = () => {
  const groupsIds = useMainStore(
    useShallow((state) => state.groups.map((group) => group.id)),
  );

  return (
    <>
      {groupsIds.map((id, index) => (
        <GroupCover key={id} index={index} />
      ))}
    </>
  );
};
