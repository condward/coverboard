import { FC } from 'react';

import { useShallowMainStore } from 'store';
import { Offsets } from 'types';
import { useGetElementSizes } from 'utils';

import { CoverStar, CoverStarDraggable } from '.';

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
    showTitle,
    showSubtitle,
    showStars,
  } = useShallowMainStore((state) => {
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
      showTitle: state.configs.covers.title.show,
      showSubtitle: state.configs.covers.subtitle.show,
      showStars: state.configs.covers.rating.show,
    };
  });

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
