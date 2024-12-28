import { FC } from 'react';

import { LabelTypes } from 'types';
import { useShallowMainStore } from 'store';
import { CommonLabelDraggable, CommonLabel } from 'CoverBoard/Common';
import { useGetSizesContext } from 'providers';
import { useGetElementSizes } from 'utils';

export const GroupCoverLabels: FC<{
  index: number;
}> = ({ index }) => {
  const {
    id,
    titleText,
    dir,
    subtitleText,
    subDir,
    x,
    y,
    scaleX,
    scaleY,
    color,
    updateGroup,
    showHelpers,
    showTitle,
    showSubtitle,
  } = useShallowMainStore((state) => {
    const {
      id,
      title: { text: titleText, dir },
      subtitle: { text: subtitleText, dir: subDir },
      pos: { x, y },
      scale: { x: scaleX, y: scaleY },
    } = state.getGroupByIdx(index);

    return {
      id,
      titleText,
      dir,
      subtitleText,
      subDir,
      x,
      y,
      scaleX,
      scaleY,
      color: state.getGroupColor(),
      updateGroup: state.updateGroup,
      showHelpers: state.configs.layout.helpers,
      showTitle: state.configs.groups.title.show,
      showSubtitle: state.configs.groups.subtitle.show,
    };
  });

  const { coverSizeWidth, coverSizeHeight } = useGetSizesContext();

  const hasTitle =
    (showTitle && !!titleText) || (showTitle && !titleText && showHelpers);

  const { getOffset, getXPosition } = useGetElementSizes<LabelTypes>([
    ...(hasTitle ? [{ dir, type: LabelTypes.TITLE }] : []),
    ...(subtitleText && showSubtitle
      ? [{ dir: subDir, type: LabelTypes.SUBTITLE }]
      : []),
  ]);

  return (
    <>
      {hasTitle && (
        <CommonLabelDraggable
          updateDir={(dir) => updateGroup(id, { title: { dir } })}
          x={x}
          y={y}
          dir={dir}
          scaleX={scaleX}
          scaleY={scaleY}>
          <CommonLabel
            color={color}
            dir={dir}
            coverLabel={LabelTypes.TITLE}
            updateLabel={(text) => updateGroup(id, { title: { text } })}
            text={titleText}
            id={id}
            fontStyle="bold"
            scaleX={scaleX}
            scaleY={scaleY}
            x={getXPosition(dir, { x: scaleX, y: scaleY })}
            y={
              coverSizeHeight * scaleY +
              getOffset({ dir: dir, type: LabelTypes.TITLE })
            }
            width={coverSizeWidth * 3}
          />
        </CommonLabelDraggable>
      )}

      {subtitleText && showSubtitle && (
        <CommonLabelDraggable
          updateDir={(dir) => updateGroup(id, { subtitle: { dir } })}
          x={x}
          y={y}
          dir={subDir}
          scaleX={scaleX}
          scaleY={scaleY}>
          <CommonLabel
            color={color}
            dir={subDir}
            coverLabel={LabelTypes.SUBTITLE}
            updateLabel={(text) => updateGroup(id, { subtitle: { text } })}
            text={subtitleText}
            id={id}
            fontStyle="bold"
            scaleX={scaleX}
            scaleY={scaleY}
            x={getXPosition(subDir, { x: scaleX, y: scaleY })}
            y={
              coverSizeHeight * scaleY +
              getOffset({ dir: subDir, type: LabelTypes.SUBTITLE })
            }
            width={coverSizeWidth * 3}
          />
        </CommonLabelDraggable>
      )}
    </>
  );
};
