import { FC, memo } from 'react';

import { useMainStore } from 'store';

import { Arrow } from './Arrow';

const MemoArrow = memo(Arrow);

export const Arrows: FC = () => {
  const arrows = useMainStore((state) => state.arrows);

  return (
    <>
      {arrows.map((arrow) => (
        <MemoArrow
          id={arrow.id}
          dir={arrow.title.dir}
          text={arrow.title.text}
          originId={arrow.origin.id}
          originDir={arrow.origin.dir}
          targetId={arrow.target.id}
          targetDir={arrow.target.dir}
          key={arrow.id}
        />
      ))}
    </>
  );
};
