import { FC } from 'react';

import { useShallowMainStore } from 'store';
import { CommonLabelDraggable, CommonLabel } from 'CoverBoard/Common';
import { LabelTypes } from 'types';
import { useGetSizesContext } from 'providers';
import { useGetElementSizes } from 'utils';

export const Offsets = {
  TITLE: LabelTypes.TITLE,
  SUBTITLE: LabelTypes.SUBTITLE,
  STAR: 'star',
} as const;
export type Offsets = (typeof Offsets)[keyof typeof Offsets];

export const CoverLabels: FC<{
  index: number;
}> = ({ index }) => {
  const { coverSizeWidth, coverSizeHeight } = useGetSizesContext();

  const {
    id,
    titleText,
    titleDir,
    subtitleText,
    subTitleDir,
    x,
    y,
    starDir,
    color,
    showSubtitle,
    showTitle,
    showStars,
    updateCover,
  } = useShallowMainStore((state) => {
    const {
      id,
      title: { text: titleText, dir: titleDir },
      subtitle: { text: subtitleText, dir: subTitleDir },
      pos: { x, y },
      star: { dir: starDir },
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
      color: state.getColor(),
      showTitle: state.configs.covers.title.show,
      showSubtitle: state.configs.covers.subtitle.show,
      showStars: state.configs.covers.rating.show,
      updateCover: state.updateCover,
    };
  });

  const { getOffset } = useGetElementSizes<Offsets>([
    ...(titleText && showTitle ? [{ dir: titleDir, type: Offsets.TITLE }] : []),
    ...(subtitleText && showSubtitle
      ? [{ dir: subTitleDir, type: Offsets.SUBTITLE }]
      : []),
    ...(showStars ? [{ dir: starDir, type: Offsets.STAR }] : []),
  ]);

  return (
    <>
      {showTitle && titleText && (
        <CommonLabelDraggable
          updateDir={(dir) => updateCover(id, { title: { dir } })}
          x={x}
          y={y}
          dir={titleDir}>
          <CommonLabel
            updateLabel={(text) => updateCover(id, { title: { text } })}
            dir={titleDir}
            coverLabel={LabelTypes.TITLE}
            text={titleText}
            id={id}
            fontStyle="bold"
            color={color}
            x={-coverSizeWidth}
            y={
              coverSizeHeight +
              getOffset({ dir: titleDir, type: Offsets.TITLE })
            }
            width={coverSizeWidth * 3}
          />
        </CommonLabelDraggable>
      )}

      {showSubtitle && subtitleText && (
        <CommonLabelDraggable
          updateDir={(dir) => updateCover(id, { subtitle: { dir } })}
          x={x}
          y={y}
          dir={subTitleDir}>
          <CommonLabel
            updateLabel={(text) => updateCover(id, { subtitle: { text } })}
            dir={subTitleDir}
            coverLabel={LabelTypes.SUBTITLE}
            text={subtitleText}
            id={id}
            color={color}
            x={-coverSizeWidth}
            y={
              coverSizeHeight +
              getOffset({ dir: subTitleDir, type: Offsets.SUBTITLE })
            }
            width={coverSizeWidth * 3}
          />
        </CommonLabelDraggable>
      )}
    </>
  );
};
