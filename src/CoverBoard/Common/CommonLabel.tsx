import { FC } from 'react';
import { useAtomValue } from 'jotai';

import { CoverSchema, GroupSchema, PosTypes, LabelTypes } from 'types';
import { pointsAtom, useTextSelected, useMainStore, useSelected } from 'store';

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
  const { selectedId } = useSelected({ id: props.id });

  if (editArrows || selectedId) return null;

  return <CommonLabelChild {...props} />;
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
  const showHelpers = useMainStore((state) => state.configs.layout.helpers);
  const { isCurrentTextSelected, setEditingText } = useTextSelected({
    id,
    text: coverLabel,
  });
  const label =
    text || (showHelpers && coverLabel === LabelTypes.TITLE)
      ? '<add title>'
      : '';

  return (
    <CommonTextLabel
      title={coverLabel}
      color={color}
      fontStyle={fontStyle}
      hasReset
      open={isCurrentTextSelected}
      setOpen={(open) => setEditingText(open ? { id, text: coverLabel } : null)}
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
