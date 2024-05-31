import { Text } from 'react-konva';
import { FC } from 'react';

import { useMainStore } from 'store';

export const GroupCountLabel: FC = () => {
  const pos0 = useMainStore(
    (state) => state.groups.filter((cov) => cov.x === 0 && cov.y === 0).length,
  );
  const coverSizeWidth = useMainStore((state) => state.getCoverSizeWidth()) * 3;
  const coverSizeHeight =
    useMainStore((state) => state.getCoverSizeHeight()) * 3;
  const fontSize = useMainStore((state) => state.getFontSize());

  return (
    <Text
      x={coverSizeWidth + fontSize / 2}
      y={coverSizeHeight - fontSize * 2}
      align="center"
      text={pos0 > 1 ? 'x' + String(pos0) : ''}
      fontSize={fontSize * 2}
      fill="white"
      listening={false}
    />
  );
};
