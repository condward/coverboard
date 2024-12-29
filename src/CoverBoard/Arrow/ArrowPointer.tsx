import { FC } from 'react';
import { Arrow } from 'react-konva';

import { ArrowParams } from 'types';
import { useMainStore } from 'store';
import { useGetSizesContext } from 'providers';

export const ArrowPointer: FC<{
  ArrowParams: ArrowParams;
}> = ({ ArrowParams }) => {
  const { fontSize } = useGetSizesContext();

  const color = useMainStore((state) => state.getArrowColor());

  return (
    <Arrow
      points={ArrowParams.points}
      stroke={color}
      strokeWidth={fontSize / 4}
      pointerLength={fontSize}
      listening={false}
    />
  );
};
