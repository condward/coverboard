import { FC, memo } from 'react';
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
import { useGetSizesContext } from 'providers';
import { useIsLandscape } from 'utils';

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
  const isLandscape = useIsLandscape();
  const color = useMainStore((state) => state.getGroupColor());
  const { fontSize, dragLimits, coverSizeWidth, coverSizeHeight } =
    useGetSizesContext();
  const setSelected = useSetAtom(selectedAtom);
  const updateGroup = useMainStore((state) => state.updateGroup);
  const updateGroupPosition = useMainStore(
    (state) => state.updateGroupPosition,
  );
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );

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

  const getXPosition = (currentDir: PosTypes) => {
    if (currentDir === PosTypes.BOTTOM || currentDir === PosTypes.TOP) {
      return (coverSizeWidth * scaleX) / 2 - (coverSizeWidth * 3) / 2;
    } else if (currentDir === PosTypes.RIGHT) {
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
          x: isLandscape
            ? dragLimits.width - coverSizeWidth * scaleX + coverSizeWidth
            : dragLimits.width - coverSizeWidth * scaleX,
          y: isLandscape
            ? dragLimits.height - coverSizeHeight * scaleY
            : dragLimits.height + dragLimits.y - coverSizeHeight * scaleY,
        }}>
        <CommonDrawLine id={id} scaleX={scaleX} scaleY={scaleY} />
        <>
          <Group onClick={handlesSelect} onTap={handlesSelect}>
            <GroupSquare id={id} scaleX={scaleX} scaleY={scaleY} />
          </Group>
          {Object.values(LabelTypes).map((labelType) => {
            const currentDir = labelType === LabelTypes.TITLE ? dir : subDir;
            const currentTitle =
              labelType === LabelTypes.TITLE ? titleText : subtitleText;
            const offSet = labelType === LabelTypes.TITLE ? offset1 : offset2;

            return (
              <CommonLabelDraggable
                updateDir={(dir) => updateGroup(id, { [labelType]: { dir } })}
                key={labelType}
                x={x}
                y={y}
                dir={currentDir}
                scaleX={scaleX}
                scaleY={scaleY}>
                <CommonLabel
                  color={color}
                  dir={currentDir}
                  coverLabel={labelType}
                  updateLabel={(text) =>
                    updateGroup(id, { [labelType]: { text } })
                  }
                  text={currentTitle}
                  id={id}
                  fontStyle="bold"
                  scaleX={scaleX}
                  scaleY={scaleY}
                  x={getXPosition(currentDir)}
                  y={coverSizeHeight * scaleY + offSet}
                  width={coverSizeWidth * 3}
                />
              </CommonLabelDraggable>
            );
          })}
        </>
      </CommonDraggable>
    </>
  );
};

export const GroupCover = memo(GroupCoverWithoutMemo);
