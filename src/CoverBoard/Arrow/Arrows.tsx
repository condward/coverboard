import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useMainStore } from 'store';

import { Arrow } from './Arrow';

export const Arrows: FC = () => {
  const arrowIds = useMainStore(
    useShallow((state) => state.arrows.map((arrow) => arrow.id)),
  );

  return (
    <>
      {arrowIds.map((id, index) => (
        <Arrow key={id} index={index} />
      ))}
    </>
  );
};
