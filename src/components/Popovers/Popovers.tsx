import { FC } from 'react';
import { useAtomValue } from 'jotai';

import { selectedAtom } from 'store';

import { ElemPopovers } from './ElemPopovers/ElemPopovers';
import { ToolbarPopovers } from './ToolbarPopovers/ToolbarPopovers';

export const Popovers: FC = () => {
  const selectedElem = useAtomValue(selectedAtom);

  return (
    <>
      {selectedElem !== null && selectedElem.open && (
        <ElemPopovers id={selectedElem.id} />
      )}
      <ToolbarPopovers />
    </>
  );
};
