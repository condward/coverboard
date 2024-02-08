import React from 'react';
import { Circle, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

import { useMainStore, useUtilsStore } from 'store';

export const LineCircle: React.FC<{ id: string }> = ({ id }) => {
  const circleRadius = useMainStore((state) => state.circleRadius());
  const isSelected = useUtilsStore((state) => state.isSelected({ id }));
  const setSelected = useUtilsStore((state) => state.setSelected);
  const color = useMainStore((state) => state.getArrowColor());

  const handleSelect = () => {
    setSelected({ id, open: isSelected });
  };

  return (
    <Group
      width={circleRadius * 3}
      height={circleRadius * 3}
      onClick={handleSelect}
      onTap={handleSelect}>
      <Circle
        radius={isSelected ? circleRadius * 1.4 : circleRadius}
        fill={color}
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          if (!isSelected) {
            evt.currentTarget.scaleX(1.4);
            evt.currentTarget.scaleY(1.4);
          }

          const container = evt.target.getStage()?.container();
          if (container) {
            container.style.cursor = 'pointer';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          if (!isSelected) {
            evt.currentTarget.scaleX(1);
            evt.currentTarget.scaleY(1);
          }

          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'default';
          }
        }}
      />
    </Group>
  );
};
