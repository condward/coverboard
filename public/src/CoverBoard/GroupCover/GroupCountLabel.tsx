import { useMainStore } from 'store';
import { Text } from 'react-konva';

export const GroupCountLabel: React.FC = () => {
  const pos0 = useMainStore(
    (state) => state.groups.filter((cov) => cov.x === 0 && cov.y === 0).length,
  );
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth()) * 3;
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight()) * 3;
  const fontSize = useMainStore((state) => state.fontSize());

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
