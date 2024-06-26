import { FC } from 'react';
import { useAtom, useSetAtom } from 'jotai';

import { parentSelectedAtom, selectedAtom, useMainStore } from 'store';

import { CoverPopover } from './CoverPopover';
import { GroupPopover } from './GroupPopover';
import { ArrowPopover } from './ArrowPopover';

export const ElemPopovers: FC<{ id: string }> = ({ id }) => {
  const setSelected = useSetAtom(selectedAtom);
  const [parentSelected, setParentSelected] = useAtom(parentSelectedAtom);
  const currentCover = useMainStore((state) =>
    state.covers.find((cov) => cov.id === id),
  );
  const currentArrow = useMainStore((state) =>
    state.arrows.find((arrow) => arrow.id === id),
  );
  const currentGroup = useMainStore((state) =>
    state.groups.find((cov) => cov.id === id),
  );

  const handleClose = (id?: string) => {
    setParentSelected([]);
    if (id) {
      setSelected({ id, open: false });
    } else {
      setSelected(null);
    }
  };

  const handleChange = (fromId: string, toId: string) => {
    setParentSelected((prev) => [...prev, fromId]);
    setSelected({ open: true, id: toId });
  };

  const handleReturn = () => {
    setSelected({
      id: parentSelected[parentSelected.length - 1],
      open: true,
    });
    setParentSelected((prev) => prev.slice(0, -1));
  };

  return (
    <>
      {currentCover && (
        <CoverPopover
          cover={currentCover}
          onClose={handleClose}
          onChange={handleChange}
          onReturn={parentSelected.length > 0 ? handleReturn : undefined}
        />
      )}
      {currentArrow && (
        <ArrowPopover
          arrow={currentArrow}
          onClose={handleClose}
          onChange={handleChange}
          onReturn={parentSelected.length > 0 ? handleReturn : undefined}
        />
      )}
      {currentGroup && (
        <GroupPopover
          group={currentGroup}
          onClose={handleClose}
          onChange={handleChange}
          onReturn={parentSelected.length > 0 ? handleReturn : undefined}
        />
      )}
    </>
  );
};
