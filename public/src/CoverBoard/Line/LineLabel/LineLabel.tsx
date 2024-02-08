import React from 'react';

import { LineParams, Lines, PosTypes, TextTypes } from 'types';
import { LineCircle, LineLabelDraggable, LinePopover } from '.';
import { useMainStore, useUtilsStore } from 'store';
import { Html } from 'react-konva-utils';
import { CommonTextLabel } from 'CoverBoard/Common';

interface LineProps {
  id: Lines['id'];
  dir: Lines['dir'];
  lineParams: LineParams;
  text: Lines['text'];
}

export const LineLabel: React.FC<LineProps> = ({
  id,
  dir,
  lineParams,
  text,
}) => {
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const fontSize = useMainStore((state) => state.fontSize());
  const color = useMainStore((state) => state.getArrowColor());
  const updateLineDir = useMainStore((state) => state.updateLineDir);
  const updateLineText = useMainStore((state) => state.updateLineText);

  const isSelectedModalOpen = useUtilsStore((state) =>
    state.isSelectedModalOpen({ id }),
  );

  const setEditingText = useUtilsStore((state) => state.setEditingText);
  const isCurrentTextSelected = useUtilsStore((state) =>
    state.isCurrentTextSelected({ id, text: TextTypes.LINELABEL }),
  );

  const handleSetOpen = (open: boolean) => {
    setEditingText(open ? { id, text: TextTypes.LINELABEL } : null);
  };

  const getLabel = () => {
    if (text) {
      return text;
    } else if (text === null) {
      return '<add text>';
    }
    return '';
  };

  const handleUpdateDir = (dir: PosTypes) => {
    updateLineDir(id, dir);
  };

  return (
    <>
      <LineLabelDraggable
        dir={dir}
        lineParams={lineParams}
        setUpdate={handleUpdateDir}>
        <CommonTextLabel
          label={getLabel()}
          color={color}
          open={isCurrentTextSelected}
          editable={true}
          setOpen={handleSetOpen}
          onReset={() => void 0}
          setLabel={(text) => updateLineText(id, text)}
          x={-coverSizeWidth}
          y={fontSize * 1.5}
          width={coverSizeWidth * 2}
          dir={dir}
          wrap="word"
        />
      </LineLabelDraggable>
      <LineCircle id={id} />
      {isSelectedModalOpen && (
        <Html>
          <LinePopover
            id={id}
            open={isSelectedModalOpen}
            values={{
              text: text ?? '',
              dir,
            }}
          />
        </Html>
      )}
    </>
  );
};
