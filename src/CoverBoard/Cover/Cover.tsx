import { FC, memo } from 'react';
import { Group } from 'react-konva';
import { useSetAtom } from 'jotai';

import { selectedAtom, useIsSelected, useMainStore } from 'store';
import {
  CommonDraggable,
  CommonDrawArrow,
  CommonLabelDraggable,
  CommonLabel,
} from 'CoverBoard/Common';
import { CoverSchema, LabelTypes } from 'types';
import { useGetSizesContext } from 'providers';
import { useGetElementSizes } from 'utils';

import { CoverLoadImage, CoverStar, CoverStarDraggable } from '.';

interface CoverImageProps {
  id: CoverSchema['id'];
  titleText: CoverSchema['title']['text'];
  subtitleText: CoverSchema['subtitle']['text'];
  x: CoverSchema['pos']['x'];
  y: CoverSchema['pos']['y'];
  titleDir: CoverSchema['title']['dir'];
  subTitleDir: CoverSchema['subtitle']['dir'];
  starDir: CoverSchema['star']['dir'];
  starCount: CoverSchema['star']['count'];
  link: CoverSchema['link'];
  renderTime: number;
}

enum Offsets {
  TITLE = LabelTypes.TITLE,
  SUBTITLE = LabelTypes.SUBTITLE,
  STAR = 'star',
}

const CoverWithoutMemo: FC<CoverImageProps> = ({
  id,
  titleText,
  subtitleText,
  x,
  y,
  titleDir,
  subTitleDir,
  starDir,
  starCount,
  link,
  renderTime,
}) => {
  const color = useMainStore((state) => state.getCoverColor());
  const showTitle = useMainStore((state) => state.configs.covers.title.show);
  const showSubtitle = useMainStore(
    (state) => state.configs.covers.subtitle.show,
  );
  const { dragLimits, coverSizeWidth, coverSizeHeight } = useGetSizesContext();
  const showStars = useMainStore((state) => state.configs.covers.rating.show);
  const setSelected = useSetAtom(selectedAtom);
  const updateCover = useMainStore((state) => state.updateCover);

  const removeCoverAndRelatedArrows = useMainStore(
    (state) => state.removeCoverAndRelatedArrows,
  );

  const { getOffset, getMaxBoundaries } = useGetElementSizes<Offsets>([
    ...(titleText && showTitle ? [{ dir: titleDir, type: Offsets.TITLE }] : []),
    ...(subtitleText && showSubtitle
      ? [{ dir: subTitleDir, type: Offsets.SUBTITLE }]
      : []),
    ...(showStars ? [{ dir: starDir, type: Offsets.STAR }] : []),
  ]);

  const isSelected = useIsSelected(id);

  const refreshCovers = useMainStore((state) => state.refreshCovers);
  const handleSelect = () => {
    setSelected({ id, open: isSelected });
    refreshCovers(id);
  };

  return (
    <>
      <CommonDraggable
        updatePosition={(pos) => updateCover(id, { pos })}
        onDelete={removeCoverAndRelatedArrows}
        id={id}
        x={x}
        y={y}
        min={{
          x: dragLimits.x,
          y: dragLimits.y,
        }}
        max={getMaxBoundaries()}>
        <CommonDrawArrow id={id} />

        <Group>
          <Group onClick={handleSelect} onTap={handleSelect}>
            <CoverLoadImage link={link} renderTime={renderTime} />
          </Group>

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

          {showStars && (
            <CoverStarDraggable id={id} x={x} y={y} starDir={starDir}>
              <CoverStar
                id={id}
                offset={getOffset({ dir: starDir, type: Offsets.STAR })}
                starCount={starCount}
              />
            </CoverStarDraggable>
          )}
        </Group>
      </CommonDraggable>
    </>
  );
};

export const Cover = memo(CoverWithoutMemo);
