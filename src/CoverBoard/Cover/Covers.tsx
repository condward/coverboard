import { FC, memo } from 'react';

import { useMainStore } from 'store';

import { Cover } from './Cover';

const MemoCover = memo(Cover);

export const Covers: FC = () => {
  const covers = useMainStore((state) => state.covers);

  return (
    <>
      {covers.map((cover, index) => (
        <MemoCover key={cover.id} cover={cover} renderTime={400 * index} />
      ))}
    </>
  );
};
