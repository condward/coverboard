import { FC } from 'react';
import { useSetAtom } from 'jotai';

import { LineParams, LineSchema, TextTypes } from 'types';
import {
  editingTextAtom,
  useIsCurrentTextSelected,
  useIsSelected,
  useMainStore,
} from 'store';
import { CommonTextLabel } from 'CoverBoard/Common';

import { LineCircle, LineLabelDraggable } from '.';

interface LineProps {
  id: LineSchema['id'];
  dir: LineSchema['dir'];
  text: LineSchema['text'];
  lineParams: LineParams;
}

export const LineLabel: FC<LineProps> = ({ id, dir, lineParams, text }) => {
  const coverSizeWidth = useMainStore((state) => state.getCoverSizeWidth());
  const fontSize = useMainStore((state) => state.getFontSize());
  const color = useMainStore((state) => state.getArrowColor());
  const updateLineDir = useMainStore((state) => state.updateLineDir);
  const updateLineText = useMainStore((state) => state.updateLineText);

  const selected = useIsSelected(id);
  const setEditingText = useSetAtom(editingTextAtom);
  const isCurrentTextSelected = useIsCurrentTextSelected({
    id,
    text: TextTypes.LINELABEL,
  });

  const handleSetOpen = (open: boolean) => {
    setEditingText(open ? { id, text: TextTypes.LINELABEL } : null);
  };

  const getLabel = () => {
    if (text) {
      return text;
    } else if (selected && text === '') {
      return '<add text>';
    }
    return '';
  };

  return (
    <>
      <LineLabelDraggable
        dir={dir}
        lineParams={lineParams}
        setUpdate={(dir) => updateLineDir(id, dir)}>
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
    </>
  );
};
