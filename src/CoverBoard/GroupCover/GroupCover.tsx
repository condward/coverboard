import { FC, memo } from 'react';
import { Group } from 'react-konva';
import { useSetAtom } from 'jotai';

import { GroupSchema, LabelTypes } from 'types';
import { selectedAtom, useIsSelected, useMainStore } from 'store';
import {
  CommonDraggable,
  CommonDrawArrow,
  CommonLabelDraggable,
  CommonLabel,
} from 'CoverBoard/Common';
import { useGetSizesContext } from 'providers';
import { useGetElementSizes } from 'utils';

import { GroupSquare } from './GroupSquare';

interface CoverImageProps {
  id: GroupSchema['id'];
  titleText: GroupSchema['title']['text'];
  subtitleText: GroupSchema['subtitle']['text'];
  x: GroupSchema['pos']['x'];
  y: GroupSchema['pos']['y'];
  dir: GroupSchema['title']['dir'];
  subDir: GroupSchema['subtitle']['dir'];
  scaleX: GroupSchema['scale']['x'];
  scaleY: GroupSchema['scale']['y'];
}

const GroupCoverWithoutMemo: FC<CoverImageProps> = ({
  id,
  titleText,
  subtitleText,
  x,
  y,
  dir,
  subDir,
  scaleX,
  scaleY,
}) => {
  const color = useMainStore((state) => state.getGroupColor());
  const { coverSizeWidth, coverSizeHeight } = useGetSizesContext();
  const setSelected = useSetAtom(selectedAtom);
  const updateGroup = useMainStore((state) => state.updateGroup);

  const removeGroupAndRelatedArrows = useMainStore(
    (state) => state.removeGroupAndRelatedArrows,
  );
  const showTitle = useMainStore((state) => state.configs.groups.title.show);
  const showSubtitle = useMainStore(
    (state) => state.configs.groups.subtitle.show,
  );
  const refreshGroups = useMainStore((state) => state.refreshGroups);

  const isSelected = useIsSelected(id);

  const handlesSelect = () => {
    setSelected({ id, open: isSelected });
    refreshGroups(id);
  };

  const { getOffset, getXPosition, getMaxBoundaries } =
    useGetElementSizes<LabelTypes>([
      ...(titleText && showTitle ? [{ dir, type: LabelTypes.TITLE }] : []),
      ...(subtitleText && showSubtitle
        ? [{ dir: subDir, type: LabelTypes.SUBTITLE }]
        : []),
    ]);

  return (
    <>
      <CommonDraggable
        updatePosition={(pos) => updateGroup(id, { pos })}
        onDelete={removeGroupAndRelatedArrows}
        id={id}
        x={x}
        y={y}
        max={getMaxBoundaries({ x: scaleX, y: scaleY })}>
        <CommonDrawArrow id={id} scaleX={scaleX} scaleY={scaleY} />
        <>
          <Group onClick={handlesSelect} onTap={handlesSelect}>
            <GroupSquare id={id} scaleX={scaleX} scaleY={scaleY} />
          </Group>

          {titleText && showTitle && (
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
      </CommonDraggable>
    </>
  );
};

export const GroupCover = memo(GroupCoverWithoutMemo);
