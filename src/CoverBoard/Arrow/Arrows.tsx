import { FC } from 'react';

import { useMainStore } from 'store';

import { Arrow } from './Arrow';

export const Arrows: FC = () => {
  const arrowIds = useMainStore((state) =>
    state.arrows.map((arrow) => arrow.id),
  );

  return (
    <>
      {arrowIds.map((id, index) => (
        <Arrow key={id} index={index} />
      ))}
    </>
  );
};
