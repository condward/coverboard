import { FC } from 'react';

import { ArrowParams, TextTypes } from 'types';
import { useTextSelected, useShallowMainStore, useSelected } from 'store';
import { CommonTextLabel } from 'CoverBoard/Common';
import { useGetSizesContext } from 'providers';

import { ArrowLabelDraggable } from '.';

interface ArrowProps {
  index: number;
  ArrowParams: ArrowParams;
}

export const ArrowDraggable: FC<ArrowProps> = ({ index, ArrowParams }) => {
  const { fontSize, coverSizeWidth } = useGetSizesContext();

  const { text, dir, id, color, updateArrow, showHelpers } =
    useShallowMainStore((state) => {
      const {
        title: { text, dir },
        id,
      } = state.getArrowByIdx(index);

      return {
        text,
        dir,
        id,
        color: state.getArrowColor(),
        updateArrow: state.updateArrow,
        showHelpers: state.configs.layout.helpers,
      };
    });

  const { selectedId } = useSelected({ id });
  const { isCurrentTextSelected, setEditingText } = useTextSelected({
    id,
    text: TextTypes.ArrowLABEL,
  });

  const getLabel = () => {
    if (text) {
      return text;
    } else if ((selectedId && text === '') || (text === '' && showHelpers)) {
      return '<add text>';
    }
    return '';
  };

  return (
    <ArrowLabelDraggable
      dir={dir}
      ArrowParams={ArrowParams}
      setUpdate={(dir) => updateArrow(id, { title: { dir } })}>
      <CommonTextLabel
        label={getLabel()}
        color={color}
        open={isCurrentTextSelected}
        editable
        setOpen={(open) => {
          setEditingText(open ? { id, text: TextTypes.ArrowLABEL } : null);
        }}
        onReset={() => void 0}
        setLabel={(text) => updateArrow(id, { title: { text } })}
        x={-coverSizeWidth}
        y={fontSize * 1.5}
        width={coverSizeWidth * 2}
        dir={dir}
        wrap="word"
      />
    </ArrowLabelDraggable>
  );
};
