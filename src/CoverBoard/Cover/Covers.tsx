import { FC, memo } from 'react';

import { useMainStore } from 'store';

import { Cover } from './Cover';

const MemoCover = memo(Cover);

export const Covers: FC = () => {
  const covers = useMainStore((state) => state.covers);

  return (
    <>
      {covers.map((cover, index) => (
        <MemoCover
          key={cover.id}
          id={cover.id}
          titleText={cover.title.text}
          subtitleText={cover.subtitle.text}
          x={cover.pos.x}
          y={cover.pos.y}
          titleDir={cover.title.dir}
          subTitleDir={cover.subtitle.dir}
          starDir={cover.star.dir}
          starCount={cover.star.count}
          link={cover.link}
          renderTime={400 * index}
        />
      ))}
    </>
  );
};
