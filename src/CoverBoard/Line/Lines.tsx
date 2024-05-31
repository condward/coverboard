import { Group } from 'react-konva';
import { FC, memo } from 'react';

import { useMainStore } from 'store';

import { Line } from './Line';

export const LinesWithoutMemo: FC = () => {
  const lines = useMainStore((state) => state.lines);

  return (
    <>
      {lines.map((line) => (
        <Group key={line.id}>
          <Line
            id={line.id}
            dir={line.dir}
            originId={line.origin.id}
            originDir={line.origin.dir}
            targetId={line.target.id}
            targetDir={line.target.dir}
            key={line.id}
            text={line.text}
          />
        </Group>
      ))}
    </>
  );
};

export const Lines = memo(LinesWithoutMemo);
