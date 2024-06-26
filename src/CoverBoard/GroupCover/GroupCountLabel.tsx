import { Text } from 'react-konva';
import { FC } from 'react';

import { useMainStore } from 'store';
import { useGetSizesContext } from 'providers';

export const GroupCountLabel: FC = () => {
  const pos0 = useMainStore(
    (state) =>
      state.groups.filter((cov) => cov.pos.x === 0 && cov.pos.y === 0).length,
  );
  const { fontSize, coverSizeWidth, coverSizeHeight } = useGetSizesContext();

  return (
    <Text
      x={coverSizeWidth * 3 + fontSize / 2}
      y={coverSizeHeight * 3 - fontSize * 2}
      align="center"
      text={pos0 > 1 ? 'x' + String(pos0) : ''}
      fontSize={fontSize * 2}
      fill="white"
      listening={false}
    />
  );
};
