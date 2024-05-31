import { FC } from 'react';

import { useMainStore } from 'store';

import { CoverPopover } from './CoverPopover';
import { GroupPopover } from './GroupPopover';
import { LinePopover } from './LinePopover';

export const ElemPopovers: FC<{ id: string }> = ({ id }) => {
  const currentCover = useMainStore((state) =>
    state.covers.find((cov) => cov.id === id),
  );
  const currentLine = useMainStore((state) =>
    state.lines.find((line) => line.id === id),
  );
  const currentGroup = useMainStore((state) =>
    state.groups.find((cov) => cov.id === id),
  );

  return (
    <>
      {currentCover && <CoverPopover cover={currentCover} />}
      {currentLine && <LinePopover line={currentLine} />}
      {currentGroup && <GroupPopover group={currentGroup} />}
    </>
  );
};
