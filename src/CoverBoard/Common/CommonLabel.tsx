import { FC } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import { CoverSchema, GroupSchema, PosTypes, LabelTypes } from 'types';
import {
  editingTextAtom,
  pointsAtom,
  useIsCurrentTextSelected,
  useIsSelected,
  useMainStore,
} from 'store';

import { CommonTextLabel } from '.';

interface CommonLabelProps {
  id: CoverSchema['id'] | GroupSchema['id'];
  coverLabel: LabelTypes;
  text: string;
  fontStyle?: 'bold';
  scaleX?: GroupSchema['scale']['x'];
  scaleY?: GroupSchema['scale']['y'];
  dir: PosTypes;
  color: string;
  updateLabel: (label: string) => void;
  x: number;
  y: number;
  width: number;
}

export const CommonLabel: FC<CommonLabelProps> = (props) => {
  const editArrows = useAtomValue(pointsAtom);
  const isSelected = useIsSelected(props.id);

  if (editArrows || isSelected) return null;

  return <CommonLabelChild {...props} />;
};

const useGetTitleText = (text: string, coverLabel: LabelTypes) => {
  const showHelpers = useMainStore((state) => state.configs.layout.helpers);

  if (text) {
    return text;
  } else if (text === '' && showHelpers && coverLabel === LabelTypes.TITLE) {
    return '<add title>';
  }
  return '';
};

const CommonLabelChild: FC<CommonLabelProps> = ({
  id,
  coverLabel,
  text,
  fontStyle,
  dir,
  color,
  updateLabel,
  x,
  y,
  width,
}) => {
  const setEditingText = useSetAtom(editingTextAtom);
  const isCurrentTextSelected = useIsCurrentTextSelected({
    id,
    text: coverLabel,
  });
  const label = useGetTitleText(text, coverLabel);

  return (
    <CommonTextLabel
      title={coverLabel}
      color={color}
      fontStyle={fontStyle}
      hasReset
      open={isCurrentTextSelected}
      setOpen={(open: boolean) =>
        setEditingText(open ? { id, text: coverLabel } : null)
      }
      editable={true}
      label={label}
      onReset={() => void 0}
      setLabel={(label) => updateLabel(label)}
      x={x}
      y={y}
      width={width}
      dir={dir}
    />
  );
};
