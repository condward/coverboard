import { FC } from 'react';

import { useMainStore } from 'store';

import { Cover } from './Cover';

export const Covers: FC = () => {
  const coverIds = useMainStore((state) =>
    state.covers.map((cover) => cover.id),
  );

  return (
    <>
      {coverIds.map((id, index) => (
        <Cover key={id} index={index} />
      ))}
    </>
  );
};
