import { FC, memo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Group } from 'react-konva';
import { useSetAtom } from 'jotai';

import { selectedAtom, useIsSelected, useMainStore } from 'store';
import {
  CommonDraggable,
  CommonDrawLine,
  CommonLabelDraggable,
  CommonLabel,
} from 'CoverBoard/Common';
import { CoverSchema, LabelTypes, PosTypes } from 'types';

import { CoverLoadImage, CoverStar, CoverStarDraggable } from '.';

interface CoverImageProps {
  id: CoverSchema['id'];
  titleText: CoverSchema['title']['text'];
  subtitleText: CoverSchema['subtitle']['text'];
  x: CoverSchema['x'];
  y: CoverSchema['y'];
  titleDir: CoverSchema['title']['dir'];
  subTitleDir: CoverSchema['subtitle']['dir'];
  starDir: CoverSchema['star']['dir'];
  starCount: CoverSchema['star']['count'];
  link: CoverSchema['link'];
  renderTime: number;
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
  const showTitle = useMainStore((state) => state.configs.showTitle);
  const showSubtitle = useMainStore((state) => state.configs.showSubtitle);
  const dragLimits = useMainStore(useShallow((state) => state.getDragLimits()));
  const fontSize = useMainStore((state) => state.getFontSize());
  const toobarIconSize = useMainStore((state) => state.getToobarIconSize());
  const windowSize = useMainStore((state) => state.windowSize);
  const showStars = useMainStore((state) => state.getShowStars());
  const setSelected = useSetAtom(selectedAtom);
  const updateCoverPosition = useMainStore(
    (state) => state.updateCoverPosition,
  );
  const updateCover = useMainStore((state) => state.updateCover);

  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const coverSizeWidth = useMainStore((state) => state.getCoverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.getCoverSizeHeight());

  let titleOffset = 0;
  let subtitleOffset = 0;
  let starOffset = 0;

  if (
    titleText &&
    showTitle &&
    subtitleText &&
    showSubtitle &&
    titleDir === subTitleDir &&
    showStars &&
    starDir === titleDir
  ) {
    titleOffset = titleDir === PosTypes.TOP ? -fontSize * 1.5 * 2 : -fontSize;
    titleOffset = titleDir === PosTypes.BOTTOM ? 0 : titleOffset;
    subtitleOffset = titleOffset + fontSize * 1.5;
    starOffset = subtitleOffset + fontSize * 1.5;
  } else if (
    titleText &&
    showTitle &&
    subtitleText &&
    showSubtitle &&
    titleDir === subTitleDir &&
    (!showStars || starDir !== titleDir)
  ) {
    titleOffset = titleDir === PosTypes.TOP ? -fontSize * 1.5 : 0;
    subtitleOffset = titleOffset + fontSize * 1.5;
  } else if (
    titleText &&
    showTitle &&
    showStars &&
    starDir === titleDir &&
    (!subtitleText || !showSubtitle || titleDir !== subTitleDir)
  ) {
    titleOffset = starDir === PosTypes.TOP ? -fontSize * 1.5 : 0;
    starOffset = titleOffset + fontSize * 1.5;
  } else if (
    subtitleText &&
    showSubtitle &&
    showStars &&
    starDir === subTitleDir &&
    (!titleText || !showTitle || titleDir !== subTitleDir)
  ) {
    subtitleOffset = starDir === PosTypes.TOP ? -fontSize * 1.5 : 0;
    starOffset = subtitleOffset + fontSize * 1.5;
  }

  const isSelected = useIsSelected(id);

  const refreshCovers = useMainStore((state) => state.refreshCovers);
  const handleSelect = () => {
    setSelected({ id, open: isSelected });
    refreshCovers(id);
  };

  return (
    <>
      <CommonDraggable
        updatePosition={updateCoverPosition}
        onDelete={removeCoverAndRelatedLines}
        id={id}
        x={x}
        y={y}
        min={{
          x: dragLimits.x,
          y: dragLimits.y,
        }}
        max={{
          x: windowSize.width - 3.5 * toobarIconSize,
          y: windowSize.height - 3.5 * toobarIconSize,
        }}>
        <CommonDrawLine id={id} />

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
                y={coverSizeHeight + titleOffset}
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
                y={coverSizeHeight + subtitleOffset}
                width={coverSizeWidth * 3}
              />
            </CommonLabelDraggable>
          )}

          {showStars && (
            <CoverStarDraggable id={id} x={x} y={y} starDir={starDir}>
              <CoverStar id={id} offset={starOffset} starCount={starCount} />
            </CoverStarDraggable>
          )}
        </Group>
      </CommonDraggable>
    </>
  );
};

export const Cover = memo(CoverWithoutMemo);
