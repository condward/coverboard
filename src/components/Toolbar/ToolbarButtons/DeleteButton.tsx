import { FC } from 'react';
import { useAtom } from 'jotai';
import { DeleteOutline } from '@mui/icons-material';

import { colorMap, Colors, KeyboardShortcuts, ToolConfigIDs } from 'types';

import { selectedAtom, useShallowMainStore } from 'store';

import { CommonButton } from './CommonButton';

export const DeleteButton: FC = () => {
  const {
    isArrow,
    isCover,
    isGroup,
    removeArrow,
    removeCoverAndRelatedArrows,
    removeGroupAndRelatedArrows,
  } = useShallowMainStore((state) => ({
    isCover: state.isCover,
    isGroup: state.isGroup,
    isArrow: state.isArrow,
    removeArrow: state.removeArrow,
    removeCoverAndRelatedArrows: state.removeCoverAndRelatedArrows,
    removeGroupAndRelatedArrows: state.removeGroupAndRelatedArrows,
  }));

  const [selected, setSelected] = useAtom(selectedAtom);
  const elemName = !selected
    ? ''
    : isCover(selected.id)
      ? '(cover)'
      : isGroup(selected.id)
        ? '(group)'
        : isArrow(selected.id)
          ? '(arrow)'
          : '';

  const deleteElem = () => {
    if (!selected) return;

    if (isGroup(selected.id)) {
      removeGroupAndRelatedArrows(selected.id);
    } else if (isCover(selected.id)) {
      removeCoverAndRelatedArrows(selected.id);
    } else if (isArrow(selected.id)) {
      removeArrow(selected.id);
    }
    setSelected(null);
  };

  return (
    <CommonButton
      config={{
        id: ToolConfigIDs.DELETE,
        tooltip: `Delete selected ${elemName}`,
        color: colorMap[Colors.RED],
        icon: <DeleteOutline />,
        value: !selected,
        valueModifier: deleteElem,
        badge: elemName !== '' ? elemName[1] : null,
        enabled: !!selected,
        shortcut: KeyboardShortcuts.DELETE,
      }}
    />
  );
};
