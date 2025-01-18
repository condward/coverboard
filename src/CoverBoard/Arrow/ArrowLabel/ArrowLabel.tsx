import { FC } from 'react';
import { Group } from 'react-konva';

import { ArrowParams } from 'types';
import { useShallowMainStore } from 'store';

import { ArrowCircle } from '.';
import { ArrowDraggable } from './ArrowDraggable';

interface ArrowProps {
  index: number;
  ArrowParams: ArrowParams;
}

export const ArrowLabel: FC<ArrowProps> = ({ index, ArrowParams }) => {
  const { showCircle } = useShallowMainStore((state) => ({
    showCircle: state.configs.arrows.circle.show,
  }));

  return (
    <Group x={ArrowParams.midX} y={ArrowParams.midY}>
      <ArrowDraggable index={index} ArrowParams={ArrowParams} />
      {showCircle && <ArrowCircle index={index} />}
    </Group>
  );
};
