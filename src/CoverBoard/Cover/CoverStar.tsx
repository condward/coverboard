import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Rect, Star } from 'react-konva';
import { FC } from 'react';
import { useAtomValue } from 'jotai';

import { pointsAtom, useIsSelected, useMainStore } from 'store';
import { CoverSchema } from 'types';
import { useGetSizesContext } from 'providers';

interface CoverStarProps {
  id: CoverSchema['id'];
  offset?: number;
  starCount: CoverSchema['star']['count'];
}

export const CoverStar: FC<CoverStarProps> = (props) => {
  const editLines = useAtomValue(pointsAtom);
  const isSelected = useIsSelected(props.id);

  if (editLines || isSelected) return null;

  return <CoverStarChild {...props} />;
};

export const CoverStarChild: FC<CoverStarProps> = ({
  id,
  offset = 0,
  starCount,
}) => {
  const { starRadius, coverSizeWidth, coverSizeHeight } = useGetSizesContext();
  const color = useMainStore((state) => state.getCoverColor());
  const backColor = useMainStore((state) => state.getBackColor());
  const updateCover = useMainStore((state) => state.updateCover);

  const handleClick = (
    evt: KonvaEventObject<MouseEvent | Event>,
    index: number,
  ) => {
    evt.cancelBubble = true;

    if (index < 0 || index > 5) return;

    let starCount = 0;
    if (index === starCount) {
      starCount = index - 1;
    } else if (index - 0.5 === starCount) {
      starCount = index;
    } else {
      starCount = index - 0.5;
    }
    updateCover(id, { star: { count: starCount } });
  };

  const totalWidth = 4 * starRadius * 3;

  return (
    <Group opacity={starCount ? 1 : 0.3} y={coverSizeHeight + offset}>
      {[0, 1, 2, 3, 4].map((index) => (
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
