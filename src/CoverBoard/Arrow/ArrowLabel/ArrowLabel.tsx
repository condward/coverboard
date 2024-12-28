import { FC } from 'react';
import { Group } from 'react-konva';

import { ArrowParams } from 'types';
import { useMainStore } from 'store';

import { ArrowCircle } from '.';
import { ArrowDraggable } from './ArrowDraggable';

interface ArrowProps {
  index: number;
  ArrowParams: ArrowParams;
}

export const ArrowLabel: FC<ArrowProps> = ({ index, ArrowParams }) => {
  const showLabel = useMainStore((state) => state.configs.arrows.title.show);

  if (!showLabel) return null;

  return (
    <Group x={ArrowParams.midX} y={ArrowParams.midY}>
      <ArrowDraggable index={index} ArrowParams={ArrowParams} />
      <ArrowCircle index={index} />
    </Group>
  );
};
