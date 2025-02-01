import { FC } from 'react';

import { useShallowMainStore } from 'store';

import { Arrow } from './Arrow';

export const Arrows: FC = () => {
  const arrowIds = useShallowMainStore((state) =>
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
