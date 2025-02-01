import { useState, FC } from 'react';
import { Group, Rect, Text } from 'react-konva';

import { useGetSizesContext } from 'providers';
import { useMainStore } from 'store';

interface TooltipProps {
  text: string;
  align?: 'left' | 'right';
  x: number;
  y: number;
}

export const BoundaryArrowTooltip: FC<TooltipProps> = ({
  text,
  align = 'left',
  x,
  y,
}) => {
  const { fontSize, coverSizeWidth } = useGetSizesContext();

  const backColor = useMainStore((state) => state.getBackColor());

  const [textWidth, setTextWidth] = useState(0);

  return (
    <Group x={x} y={y}>
      <Rect
        x={align === 'right' ? coverSizeWidth * 2 - textWidth : 0}
        width={textWidth}
        height={fontSize}
        fill={backColor}
        listening={false}
      />
      <Text
        ref={(node) => {
          if (node) {
            setTextWidth(node.getTextWidth());
          }
        }}
        width={coverSizeWidth * 2}
        align={align}
        text={text}
        fontSize={fontSize}
        fill="white"
        listening={false}
      />
    </Group>
  );
};
