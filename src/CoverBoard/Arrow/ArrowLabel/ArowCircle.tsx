import { FC, useEffect } from 'react';
import { Circle, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useSetAtom } from 'jotai';

import { selectedAtom, useGetSelectedId, useShallowMainStore } from 'store';
import { useGetSizesContext } from 'providers';
import { KeyboardShortcuts } from 'types';

export const ArrowCircle: FC<{ index: number }> = ({ index }) => {
  const { id, color, showArrow, removeArrow } = useShallowMainStore((state) => {
    const { id } = state.getArrowByIdx(index);

    return {
      id,
      color: state.getArrowColor(),
      showArrow: state.configs.arrows.circle.show,
      removeArrow: state.removeArrow,
    };
  });
  const { circleRadius } = useGetSizesContext();
  const selectedId = useGetSelectedId(id);
  const setSelected = useSetAtom(selectedAtom);

  const handleSelect = () => {
    setSelected({ id, open: !!selectedId });
  };

  useEffect(() => {
    if (!selectedId) return;

    const keyFn = (e: KeyboardEvent) => {
      if (
        e.key === 'Delete' ||
        (e.key as KeyboardShortcuts) === KeyboardShortcuts.DELETE
      ) {
        removeArrow(selectedId);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setSelected(null);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', keyFn);

    return () => window.removeEventListener('keydown', keyFn);
  }, [removeArrow, selectedId, setSelected]);

  if (!showArrow) return null;

  return (
    <Group
      width={circleRadius * 3}
      height={circleRadius * 3}
      onClick={handleSelect}
      onTap={handleSelect}>
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
