import { FC } from 'react';
import { Circle, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useSetAtom } from 'jotai';

import { selectedAtom, useGetSelectedId, useShallowMainStore } from 'store';
import { useGetSizesContext } from 'providers';
import { ArrowSelected } from '.';

export const ArrowCircle: FC<{ index: number }> = ({ index }) => {
  const { circleRadius } = useGetSizesContext();

  const { id, color } = useShallowMainStore((state) => {
    const { id } = state.getArrowByIdx(index);

    return {
      id,
      color: state.getArrowColor(),
    };
  });

  const setSelected = useSetAtom(selectedAtom);
  const selectedId = useGetSelectedId(id);

  const handleSelect = () => {
    setSelected({ id, open: !!selectedId });
  };

  return (
    <Group
      width={circleRadius * 3}
      height={circleRadius * 3}
      onClick={handleSelect}
      onTap={handleSelect}>
      {selectedId && <ArrowSelected id={selectedId} />}
      <Circle
        radius={selectedId ? circleRadius * 1.4 : circleRadius}
        fill={color}
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          if (!selectedId) {
            evt.currentTarget.scaleX(1.4);
            evt.currentTarget.scaleY(1.4);
          }

          const container = evt.target.getStage()?.container();
          if (container) {
            container.style.cursor = 'pointer';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          if (!selectedId) {
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
