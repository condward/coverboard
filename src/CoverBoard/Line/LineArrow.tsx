import { FC } from 'react';
import { Arrow } from 'react-konva';

import { LineParams } from 'types';
import { useMainStore } from 'store';

export const LineArrow: FC<{
  lineParams: LineParams;
}> = ({ lineParams }) => {
  const fontSize = useMainStore((state) => state.getFontSize());
  const color = useMainStore((state) => state.getArrowColor());

  return (
    <Arrow
      points={lineParams.points}
      stroke={color}
      strokeWidth={fontSize / 4}
      pointerLength={fontSize}
      listening={false}
    />
  );
};
