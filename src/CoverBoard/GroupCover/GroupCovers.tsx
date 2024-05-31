import { FC, memo } from 'react';

import { useMainStore } from 'store';

import { GroupCover } from './GroupCover';

export const GroupCoversWithoutMemo: FC = () => {
  const groups = useMainStore((state) => state.groups);

  return (
    <>
      {groups.map((group) => (
        <GroupCover
          key={group.id}
          id={group.id}
          titleText={group.title.text}
          subtitleText={group.subtitle.text}
          x={group.x}
          y={group.y}
          dir={group.title.dir}
          subDir={group.subtitle.dir}
          scaleX={group.scaleX}
          scaleY={group.scaleY}
        />
      ))}
    </>
  );
};

export const GroupCovers = memo(GroupCoversWithoutMemo);
