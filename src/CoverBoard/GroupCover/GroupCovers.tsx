import { useMainStore } from 'store';
import { GroupCover } from './GroupCover';

export const GroupCovers: React.FC = () => {
  const groups = useMainStore((state) => state.groups);
  return (
    <>
      {groups.map((group) => (
        <GroupCover
          key={group.id}
          id={group.id}
          title={group.title.text}
          subtitle={group.subtitle.text}
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
