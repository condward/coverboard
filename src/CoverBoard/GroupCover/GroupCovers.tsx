import { FC, memo } from 'react';

import { useMainStore } from 'store';

import { GroupCover } from './GroupCover';

const MemoGroupCover = memo(GroupCover);

export const GroupCovers: FC = () => {
  const groups = useMainStore((state) => state.groups);

  return (
    <>
      {groups.map((group) => (
        <MemoGroupCover key={group.id} group={group} />
      ))}
    </>
  );
};
