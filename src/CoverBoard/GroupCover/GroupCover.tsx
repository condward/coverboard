import { FC, memo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Group } from 'react-konva';
import { useSetAtom } from 'jotai';

import { GroupSchema, LabelTypes, PosTypes } from 'types';
import { selectedAtom, useIsSelected, useMainStore } from 'store';
import {
  CommonDraggable,
  CommonDrawLine,
  CommonLabelDraggable,
  CommonLabel,
} from 'CoverBoard/Common';

import { GroupSquare } from './GroupSquare';

interface CoverImageProps {
  id: GroupSchema['id'];
  titleText: GroupSchema['title']['text'];
  subtitleText: GroupSchema['subtitle']['text'];
  x: GroupSchema['x'];
  y: GroupSchema['y'];
  dir: GroupSchema['title']['dir'];
  subDir: GroupSchema['subtitle']['dir'];
  scaleX: GroupSchema['scaleX'];
  scaleY: GroupSchema['scaleY'];
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
  const dragLimits = useMainStore(useShallow((state) => state.getDragLimits()));
  const fontSize = useMainStore((state) => state.getFontSize());
  const toobarIconSize = useMainStore((state) => state.getToobarIconSize());
  const windowSize = useMainStore((state) => state.windowSize);
  const setSelected = useSetAtom(selectedAtom);
  const updateGroup = useMainStore((state) => state.updateGroup);
  const updateGroupPosition = useMainStore(
    (state) => state.updateGroupPosition,
  );
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );
  const coverSizeWidth = useMainStore((state) => state.getCoverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.getCoverSizeHeight());

  const offSetSubTitle =
    subtitleText && dir === subDir && dir !== PosTypes.BOTTOM ? -fontSize : 0;
  const offset1 =
    dir === subDir && subtitleText && dir === PosTypes.TOP
      ? -fontSize * 1.5
      : offSetSubTitle;
  const offset2 = dir === subDir && titleText ? offset1 + fontSize * 1.5 : 0;

  const isSelected = useIsSelected(id);

  const refreshGroups = useMainStore((state) => state.refreshGroups);
  const handlesSelect = () => {
    setSelected({ id, open: isSelected });
    refreshGroups(id);
  };

  const getXPosition = () => {
    if (dir === PosTypes.BOTTOM || dir === PosTypes.TOP) {
      return (coverSizeWidth * scaleX) / 2 - (coverSizeWidth * 3) / 2;
    } else if (dir === PosTypes.RIGHT) {
      return -coverSizeWidth * scaleX;
    }
    return coverSizeWidth * scaleX * 2 - coverSizeWidth * 3;
  };

  return (
    <>
      <CommonDraggable
        updatePosition={updateGroupPosition}
        onDelete={removeGroupAndRelatedLines}
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
        <CommonDrawLine id={id} scaleX={scaleX} scaleY={scaleY} />
        <>
          <Group onClick={handlesSelect} onTap={handlesSelect}>
            <GroupSquare id={id} scaleX={scaleX} scaleY={scaleY} />
          </Group>
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
              x={getXPosition()}
              y={coverSizeHeight * scaleY + offset1}
              width={coverSizeWidth * 3}
            />
          </CommonLabelDraggable>

          {subtitleText && (
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
                x={getXPosition()}
                y={coverSizeHeight * scaleY + offset2}
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
