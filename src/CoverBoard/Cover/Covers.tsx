import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useMainStore } from 'store';

import { Cover } from './Cover';

export const Covers: FC = () => {
  const coverIds = useMainStore(
    useShallow((state) => state.covers.map((cover) => cover.id)),
  );

  return (
    <>
      {coverIds.map((id, index) => (
        <Cover key={id} index={index} />
      ))}
    </>
  );
};
