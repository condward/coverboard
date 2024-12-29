import { FC } from 'react';

import { useShallowMainStore } from 'store';

import { Cover } from './Cover';

export const Covers: FC = () => {
  const coverIds = useShallowMainStore((state) =>
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
