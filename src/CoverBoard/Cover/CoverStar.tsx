import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Rect, Star } from 'react-konva';
import { useMainStore, useUtilsStore } from 'store';
import { Covers } from 'types';

interface CoverStarProps {
  id: Covers['id'];
  offset?: number;
  starCount: number;
}

export const CoverStar: React.FC<CoverStarProps> = ({
  id,
  offset = 0,
  starCount,
}) => {
  const starRadius = useMainStore((state) => state.starRadius());
  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight());
  const color = useMainStore((state) => state.getCoverColor());
  const backColor = useMainStore((state) => state.getBackColor());
  const updateStarCount = useMainStore((state) => state.updateStarCount);
  const editLines = useUtilsStore((state) => state.points);

  const handleClick = (
    evt: KonvaEventObject<MouseEvent | Event>,
    index: number,
  ) => {
    evt.cancelBubble = true;

    if (index < 0 || index > 5) return;

    if (index === starCount) {
      updateStarCount(id, index - 1);
    } else if (index - 0.5 === starCount) {
      updateStarCount(id, index);
    } else {
      updateStarCount(id, index - 0.5);
    }
  };

  const totalWidth = 4 * starRadius * 3;
  const isSelected = useUtilsStore((state) => state.isSelected({ id }));

  if (editLines || isSelected) return null;

  return (
    <Group opacity={starCount ? 1 : 0.3} y={coverSizeHeight + offset}>
      {[...Array(5)].map((_, index) => (
        <Group
          key={index}
          x={coverSizeWidth / 2 + index * starRadius * 3 - totalWidth / 2}
          onClick={(evt) => handleClick(evt, index + 1)}
          onTap={(evt) => handleClick(evt, index + 1)}>
          <Rect
            x={-1.5 * starRadius}
            y={-1.5 * starRadius}
            width={3.5 * starRadius}
            height={starRadius * 3.5}
            fill={backColor}
          />
          <Star
            numPoints={5}
            innerRadius={starRadius / 1.7}
            outerRadius={starRadius}
            fill={index < starCount ? color : 'transparent'}
            stroke={color}
            strokeWidth={2}
          />
          {index === Math.floor(starCount) && !Number.isInteger(starCount) && (
            <>
              <Rect
                y={-starRadius}
                width={starRadius * 0.9}
                height={starRadius * 2}
                fill={backColor}
              />
              <Star
                numPoints={5}
                innerRadius={starRadius / 1.7}
                outerRadius={starRadius}
                stroke={color}
                strokeWidth={2}
              />
            </>
          )}
        </Group>
      ))}
    </Group>
  );
};
