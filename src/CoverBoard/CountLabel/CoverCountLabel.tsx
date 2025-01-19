import { Text } from 'react-konva';
import { FC } from 'react';

import { useMainStore } from 'store';
import { useGetSizesContext } from 'providers';

export const CoverCountLabel: FC = () => {
  const { fontSize, coverSizeWidth, coverSizeHeight } = useGetSizesContext();

  const pos0 = useMainStore(
    (state) =>
      state.covers.filter((cov) => cov.pos.x === 0 && cov.pos.y === 0).length,
  );

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
