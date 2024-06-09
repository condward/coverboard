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
  text: string | null;
  fontStyle?: 'bold';
  scaleX?: GroupSchema['scaleX'];
  scaleY?: GroupSchema['scaleY'];
  dir: PosTypes;
  color: string;
  updateLabel: (label: string) => void;
  x: number;
  y: number;
  width: number;
}

export const CommonLabel: FC<CommonLabelProps> = (props) => {
  const editLines = useAtomValue(pointsAtom);
  const isSelected = useIsSelected(props.id);

  if (editLines || isSelected) return null;

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
  const setEditingText = useSetAtom(editingTextAtom);
  const isCurrentTextSelected = useIsCurrentTextSelected({
    id,
    text: coverLabel,
  });
  const showHelpers = useMainStore((state) => state.configs.showHelpers);

  const handleSetOpen = (open: boolean) => {
    open ? setEditingText({ id, text: coverLabel }) : setEditingText(null);
  };

  const getTitleText = () => {
    if (text) {
      return text;
    } else if (text === '' && showHelpers && coverLabel === LabelTypes.TITLE) {
      return '<add title>';
    }
    return '';
  };

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
      setLabel={(label) => updateLabel(label)}
      x={x}
      y={y}
      width={width}
      dir={dir}
    />
  );
};
