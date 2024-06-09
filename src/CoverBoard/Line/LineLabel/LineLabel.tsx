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
import { useGetSizesContext } from 'providers';

import { LineCircle, LineLabelDraggable } from '.';

interface LineProps {
  id: LineSchema['id'];
  dir: LineSchema['title']['dir'];
  text: LineSchema['title']['text'];
  lineParams: LineParams;
}

export const LineLabel: FC<LineProps> = ({ id, dir, lineParams, text }) => {
  const { fontSize, coverSizeWidth } = useGetSizesContext();
  const color = useMainStore((state) => state.getArrowColor());
  const updateLine = useMainStore((state) => state.updateLine);
  const showHelpers = useMainStore((state) => state.configs.visibility.helpers);

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
    } else if ((selected && text === '') || (text === '' && showHelpers)) {
      return '<add text>';
    }
    return '';
  };

  return (
    <>
      <LineLabelDraggable
        dir={dir}
        lineParams={lineParams}
        setUpdate={(dir) => updateLine(id, { title: { dir } })}>
        <CommonTextLabel
          label={getLabel()}
          color={color}
          open={isCurrentTextSelected}
          editable={true}
          setOpen={handleSetOpen}
          onReset={() => void 0}
          setLabel={(text) => updateLine(id, { title: { text } })}
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
