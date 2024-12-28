import { FC } from 'react';
import { useSetAtom } from 'jotai';
import { Group } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';

import { ArrowParams, TextTypes } from 'types';
import {
  editingTextAtom,
  useIsCurrentTextSelected,
  useIsSelected,
  useMainStore,
} from 'store';
import { CommonTextLabel } from 'CoverBoard/Common';
import { useGetSizesContext } from 'providers';

import { ArrowCircle, ArrowLabelDraggable } from '.';

interface ArrowProps {
  index: number;
  ArrowParams: ArrowParams;
}

export const ArrowLabel: FC<ArrowProps> = ({ index, ArrowParams }) => {
  const { text, dir, id } = useMainStore(
    useShallow((state) => {
      const {
        title: { text, dir },
        id,
      } = state.getArrowByIdx(index);

      return {
        text,
        dir,
        id,
      };
    }),
  );
  const { fontSize, coverSizeWidth } = useGetSizesContext();
  const color = useMainStore((state) => state.getArrowColor());
  const updateArrow = useMainStore((state) => state.updateArrow);
  const showHelpers = useMainStore((state) => state.configs.layout.helpers);

  const selected = useIsSelected(id);
  const setEditingText = useSetAtom(editingTextAtom);
  const isCurrentTextSelected = useIsCurrentTextSelected({
    id,
    text: TextTypes.ArrowLABEL,
  });
  const showLabel = useMainStore((state) => state.configs.arrows.title.show);

  const handleSetOpen = (open: boolean) => {
    setEditingText(open ? { id, text: TextTypes.ArrowLABEL } : null);
  };

  const getLabel = () => {
    if (text) {
      return text;
    } else if ((selected && text === '') || (text === '' && showHelpers)) {
      return '<add text>';
    }
    return '';
  };

  if (!showLabel) return null;

  return (
    <Group x={ArrowParams.midX} y={ArrowParams.midY}>
      <ArrowLabelDraggable
        dir={dir}
        ArrowParams={ArrowParams}
        setUpdate={(dir) => updateArrow(id, { title: { dir } })}>
        <CommonTextLabel
          label={getLabel()}
          color={color}
          open={isCurrentTextSelected}
          editable={true}
          setOpen={handleSetOpen}
          onReset={() => void 0}
          setLabel={(text) => updateArrow(id, { title: { text } })}
          x={-coverSizeWidth}
          y={fontSize * 1.5}
          width={coverSizeWidth * 2}
          dir={dir}
          wrap="word"
        />
      </ArrowLabelDraggable>
      <ArrowCircle id={id} />
    </Group>
  );
};
