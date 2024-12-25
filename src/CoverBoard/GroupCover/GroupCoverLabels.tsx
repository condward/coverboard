import { FC } from 'react';

import { GroupSchema, LabelTypes } from 'types';
import { useMainStore } from 'store';
import { CommonLabelDraggable, CommonLabel } from 'CoverBoard/Common';
import { useGetSizesContext } from 'providers';
import { useGetElementSizes } from 'utils';

export const GroupCoverLabels: FC<{
  group: GroupSchema;
}> = ({ group }) => {
  const {
    id,
    title: { text: titleText, dir },
    subtitle: { text: subtitleText, dir: subDir },
    pos: { x, y },
    scale: { x: scaleX, y: scaleY },
  } = group;

  const color = useMainStore((state) => state.getGroupColor());
  const { coverSizeWidth, coverSizeHeight } = useGetSizesContext();
  const updateGroup = useMainStore((state) => state.updateGroup);
  const showHelpers = useMainStore((state) => state.configs.layout.helpers);

  const showTitle = useMainStore((state) => state.configs.groups.title.show);
  const showSubtitle = useMainStore(
    (state) => state.configs.groups.subtitle.show,
  );

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
