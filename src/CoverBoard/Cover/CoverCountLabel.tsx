import { Text } from 'react-konva';
import { FC } from 'react';

import { useMainStore } from 'store';

export const CoverCountLabel: FC = () => {
  const pos0 = useMainStore(
    (state) => state.covers.filter((cov) => cov.x === 0 && cov.y === 0).length,
  );
  const coverSizeWidth = useMainStore((state) => state.getCoverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.getCoverSizeHeight());
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
