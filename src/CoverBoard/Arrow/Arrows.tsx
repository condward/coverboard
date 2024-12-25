import { FC, memo } from 'react';

import { useMainStore } from 'store';

import { Arrow } from './Arrow';

const MemoArrow = memo(Arrow);

export const Arrows: FC = () => {
  const arrows = useMainStore((state) => state.arrows);

  return (
    <>
      {arrows.map((arrow) => (
        <MemoArrow key={arrow.id} arrow={arrow} />
      ))}
    </>
  );
};
