import { Group } from 'react-konva';
import { FC, memo } from 'react';

import { useMainStore } from 'store';

import { Arrow } from './Arrow';

export const ArrowsWithoutMemo: FC = () => {
  const arrows = useMainStore((state) => state.arrows);

  return (
    <>
      {arrows.map((arrow) => (
        <Group key={arrow.id}>
          <Arrow
            id={arrow.id}
            dir={arrow.title.dir}
            text={arrow.title.text}
            originId={arrow.origin.id}
            originDir={arrow.origin.dir}
            targetId={arrow.target.id}
            targetDir={arrow.target.dir}
            key={arrow.id}
          />
        </Group>
      ))}
    </>
  );
};

export const Arrows = memo(ArrowsWithoutMemo);
