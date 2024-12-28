import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useMainStore } from 'store';
import { LabelTypes } from 'types';
import { useGetElementSizes } from 'utils';

import { CoverStar, CoverStarDraggable } from '.';

enum Offsets {
  TITLE = LabelTypes.TITLE,
  SUBTITLE = LabelTypes.SUBTITLE,
  STAR = 'star',
}

export const CoverStars: FC<{
  index: number;
}> = ({ index }) => {
  const {
    id,
    titleText,
    titleDir,
    subtitleText,
    subTitleDir,
    x,
    y,
    starDir,
    starCount,
  } = useMainStore(
    useShallow((state) => {
      const {
        id,
        title: { text: titleText, dir: titleDir },
        subtitle: { text: subtitleText, dir: subTitleDir },
        pos: { x, y },
        star: { dir: starDir, count: starCount },
      } = state.getCoverByIdx(index);

      return {
        id,
        titleText,
        titleDir,
        subtitleText,
        subTitleDir,
        x,
        y,
        starDir,
        starCount,
      };
    }),
  );

  const showTitle = useMainStore((state) => state.configs.covers.title.show);
  const showSubtitle = useMainStore(
    (state) => state.configs.covers.subtitle.show,
  );
  const showStars = useMainStore((state) => state.configs.covers.rating.show);
  const { getOffset } = useGetElementSizes<Offsets>([
    ...(titleText && showTitle ? [{ dir: titleDir, type: Offsets.TITLE }] : []),
    ...(subtitleText && showSubtitle
      ? [{ dir: subTitleDir, type: Offsets.SUBTITLE }]
      : []),
    ...(showStars ? [{ dir: starDir, type: Offsets.STAR }] : []),
  ]);

  return showStars ? (
    <CoverStarDraggable id={id} x={x} y={y} starDir={starDir}>
      <CoverStar
        id={id}
        offset={getOffset({ dir: starDir, type: Offsets.STAR })}
        starCount={starCount}
      />
    </CoverStarDraggable>
  ) : null;
};
