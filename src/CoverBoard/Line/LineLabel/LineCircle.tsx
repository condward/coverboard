import { FC } from 'react';
import { Circle, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useSetAtom } from 'jotai';

import { selectedAtom, useIsSelected, useMainStore } from 'store';
import { LineSchema } from 'types';
import { useGetSizesContext } from 'providers';

export const LineCircle: FC<{ id: LineSchema['id'] }> = ({ id }) => {
  const { circleRadius } = useGetSizesContext();
  const isSelected = useIsSelected(id);
  const setSelected = useSetAtom(selectedAtom);
  const color = useMainStore((state) => state.getArrowColor());
  const showArrow = useMainStore((state) => state.configs.visibility.arrows);

  const handleSelect = () => {
    setSelected({ id, open: isSelected });
  };

  if (!showArrow) return null;

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
