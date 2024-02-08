import React from 'react';

import { Covers, GroupCovers, PosTypes, LabelTypes } from 'types';
import { useUtilsStore } from 'store';
import { CommonTextLabel } from '.';

interface CommonLabelProps {
  id: Covers['id'] | GroupCovers['id'];
  coverLabel: LabelTypes;
  text: string | null;
  fontStyle?: 'bold';
  scaleX?: GroupCovers['scaleX'];
  scaleY?: GroupCovers['scaleY'];
  dir: PosTypes;
  color: string;
  updateLabel: (coverId: string, coverLabel: LabelTypes, label: string) => void;
  x: number;
  y: number;
  width: number;
}

export const CommonLabel: React.FC<CommonLabelProps> = ({
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
  const editLines = useUtilsStore((state) => state.points);
  const selected = useUtilsStore((state) => state.selected);
  const isSelected = !!selected && selected.id === id;
  const setEditingText = useUtilsStore((state) => state.setEditingText);
  const isCurrentTextSelected = useUtilsStore((state) =>
    state.isCurrentTextSelected({ id, text: coverLabel }),
  );

  const handleSetOpen = (open: boolean) => {
    open ? setEditingText({ id, text: coverLabel }) : setEditingText(null);
  };

  const getTitleText = () => {
    if (text) {
      return text;
    } else if (text === null) {
      return '<add title>';
    }
    return '';
  };

  if (editLines || isSelected) return null;

  return (
    <CommonTextLabel
      title={coverLabel}
      color={color}
      fontStyle={fontStyle}
      hasReset
      open={isCurrentTextSelected}
      setOpen={handleSetOpen}
      editable={true}
      label={getTitleText()}
      onReset={() => void 0}
      setLabel={(label) => {
        updateLabel(id, coverLabel, label);
      }}
      x={x}
      y={y}
      width={width}
      dir={dir}
    />
  );
};
