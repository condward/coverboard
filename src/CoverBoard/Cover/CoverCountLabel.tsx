import { Text } from 'react-konva';
import { FC } from 'react';

import { useMainStore } from 'store';
import { useGetSizesContext } from 'providers';

export const CoverCountLabel: FC = () => {
  const pos0 = useMainStore(
    (state) => state.covers.filter((cov) => cov.x === 0 && cov.y === 0).length,
  );
  const { fontSize, coverSizeWidth, coverSizeHeight } = useGetSizesContext();

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
