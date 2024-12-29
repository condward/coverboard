import Konva from 'konva';
import { useRef, useState, useEffect, FC } from 'react';
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

  const textRef = useRef<Konva.Text>(null);

  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.getTextWidth());
    }
  }, [textRef, text]);

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
        ref={textRef}
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
