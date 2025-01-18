import { FC, useCallback, useEffect } from 'react';
import { Group, Rect } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { v4 as uuidv4 } from 'uuid';
import { useAtom, useSetAtom } from 'jotai';
import { ZodError } from 'zod';

import { PosTypes } from 'types';
import { useGetSizesContext } from 'providers';
import {
  pointsAtom,
  useGetPointDirection,
  useShallowMainStore,
  useShowToast,
} from 'store';
import { CommonPointUnselected } from '.';

export const CommonSelectedArrows: FC<{
  id: string;
  scaleX?: number;
  scaleY?: number;
}> = ({ id, scaleX = 1, scaleY = 1 }) => {
  const { coverSizeWidth, coverSizeHeight } = useGetSizesContext();

  const { showErrorMessage } = useShowToast();
  const { arrows, addArrow, updateArrow, labelDir } = useShallowMainStore(
    (state) => {
      return {
        arrows: state.arrows,
        addArrow: state.addArrow,
        updateArrow: state.updateArrow,
        labelDir: state.configs.arrows.title.dir,
      };
    },
  );

  const [points, setPoints] = useAtom(pointsAtom);
  const pointDirection = useGetPointDirection(id);

  const handleDrawArrow = useCallback(
    (id: string, dir: PosTypes) => {
      if (!points) {
        setPoints({ id, dir });
      } else if (points.id !== id) {
        setPoints(null);
        try {
          if (
            arrows.some(
              (currentArrow) =>
                currentArrow.target.id === id && points.id === id,
            )
          ) {
            return;
          }

          const foundArrow = arrows.find(
            (currentArrow) =>
              currentArrow.target.id === id &&
              points.id === currentArrow.origin.id,
          );
          if (foundArrow) {
            updateArrow(foundArrow.id, {
              origin: points,
              target: { id, dir },
            });
            return;
          }

          const foundArrowReverse = arrows.find(
            (currentArrow) =>
              currentArrow.origin.id === id &&
              points.id === currentArrow.target.id,
          );
          if (foundArrowReverse) {
            updateArrow(foundArrowReverse.id, {
              origin: points,
              target: { id, dir },
            });
            return;
          }

          addArrow({
            title: {
              text: '',
              dir: labelDir,
            },
            origin: { ...points },
            target: { id, dir },
            id: uuidv4(),
          });
        } catch (error) {
          if (error instanceof ZodError) {
            const tooBig = error.issues.find((msg) => msg.code === 'too_big');

            if (tooBig) {
              showErrorMessage(tooBig.message);
              return;
            }
            showErrorMessage('Bad formatted arrow');
            return;
          }
          throw error;
        }
      } else if (points.id === id) {
        setPoints(null);
      }
    },
    [
      addArrow,
      arrows,
      labelDir,
      points,
      setPoints,
      showErrorMessage,
      updateArrow,
    ],
  );

  const square = 25 + (coverSizeWidth * scaleX) / 20;
  const posArray = [
    {
      dir: PosTypes.TOP,
      x: (coverSizeWidth * scaleX) / 2,
      y: -square / 1.5,
      width: square,
      height: square,
    },
    {
      dir: PosTypes.RIGHT,
      x: coverSizeWidth * scaleX,
      y: (coverSizeHeight * scaleY) / 2 - square / 1.5,
      width: square,
      height: square,
    },
    {
      dir: PosTypes.LEFT,
      x: 0,
      y: (coverSizeHeight * scaleY) / 2 - square / 1.5,
      width: square,
      height: square,
    },
    {
      dir: PosTypes.BOTTOM,
      x: (coverSizeWidth * scaleX) / 2,
      y: coverSizeHeight * scaleY - square / 1.5,
      width: square,
      height: square,
    },
  ];

  return (
    <Group>
      {points !== null && (
        <CommonPointUnselected id={id} handleDrawArrow={handleDrawArrow} />
      )}
      {posArray.map((pos) => (
        <Rect
          key={pos.dir}
          x={pos.x}
          y={pos.y}
          width={pos.width}
          height={pos.height}
          fill={pointDirection === pos.dir ? 'red' : 'white'}
          rotation={45}
          opacity={pointDirection === pos.dir ? 0.3 : 0.05}
          visible={!pointDirection || pointDirection === pos.dir}
          onClick={() => handleDrawArrow(id, pos.dir)}
          onTap={() => handleDrawArrow(id, pos.dir)}
          onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
            if (pointDirection !== pos.dir) {
              evt.currentTarget.opacity(0.3);
            }
          }}
          onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
            evt.currentTarget.opacity(pointDirection === pos.dir ? 0.3 : 0.05);
          }}
        />
      ))}
    </Group>
  );
};
