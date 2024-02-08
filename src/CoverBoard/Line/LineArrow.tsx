import React from 'react';
import { Arrow } from 'react-konva';

import { LineParams } from 'types';
import { useMainStore } from 'store';

interface LineProps {
  lineParams: LineParams;
}

export const LineArrow: React.FC<LineProps> = ({ lineParams }) => {
  const fontSize = useMainStore((state) => state.fontSize());
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
