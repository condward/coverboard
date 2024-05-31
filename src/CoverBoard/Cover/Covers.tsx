import { FC, memo } from 'react';

import { useMainStore } from 'store';

import { Cover } from './Cover';

export const CoversWithoutMemo: FC = () => {
  const covers = useMainStore((state) => state.covers);

  return (
    <>
      {covers.map((cover, index) => (
        <Cover
          key={cover.id}
          id={cover.id}
          titleText={cover.title.text}
          subtitleText={cover.subtitle.text}
          x={cover.x}
          y={cover.y}
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

export const Covers = memo(CoversWithoutMemo);
