import { FC } from 'react';

import { useMainStore } from 'store';

import { GroupCover } from './GroupCover';

export const GroupCovers: FC = () => {
  const groups = useMainStore((state) => state.groups);

  return (
    <>
      {groups.map((group) => (
        <GroupCover
          key={group.id}
          id={group.id}
          titleText={group.title.text}
          subtitleText={group.subtitle.text}
          x={group.pos.x}
          y={group.pos.y}
          dir={group.title.dir}
          subDir={group.subtitle.dir}
          scaleX={group.scale.x}
          scaleY={group.scale.y}
        />
      ))}
    </>
  );
};
