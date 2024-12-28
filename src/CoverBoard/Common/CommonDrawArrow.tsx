import { FC, useCallback, useEffect } from 'react';
import { Group, Rect } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useAtom, useAtomValue } from 'jotai';
import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useShallow } from 'zustand/react/shallow';

import { PosTypes } from 'types';
import {
  useMainStore,
  pointsAtom,
  useIsSelected,
  useToastStore,
  selectedAtom,
} from 'store';
import { useGetSizesContext } from 'providers';

interface CommonDrawArrowProps {
  index: number;
  type: 'cover' | 'group';
}

const useShowArrow = (id: string) => {
  const covers = useMainStore((state) => state.covers);
  const points = useAtomValue(pointsAtom);
  const groups = useMainStore((state) => state.groups);
  const getGroupsOfCover = useMainStore((state) => state.getGroupsOfCover);
  const getGroupsOfGroup = useMainStore((state) => state.getGroupsOfGroup);
  const getGroupsInsideGroup = useMainStore(
    (state) => state.getGroupsInsideGroup,
  );
  const getCoversInsideGroup = useMainStore(
    (state) => state.getCoversInsideGroup,
  );

  if (points) {
    const cover = covers.find((cover) => cover.id === points.id);
    if (cover) {
      return !getGroupsOfCover(cover.id).some((val) => val.id === id);
    }

    const group = groups.find((group) => group.id === points.id);
    if (group) {
      return !(
        getGroupsOfGroup(group.id).some((val) => val.id === id) ||
        getGroupsInsideGroup(group.id).some((val) => val.id === id) ||
        getCoversInsideGroup(group.id).some((val) => val.id === id)
      );
    }
  }
  return true;
};

export const CommonDrawArrow: FC<CommonDrawArrowProps> = ({ index, type }) => {
  const { id, scaleX, scaleY } = useMainStore(
    useShallow((state) => {
      if (type === 'group') {
        const { scale, id } = state.getGroupByIdx(index);

        return {
          scaleX: scale.x,
          scaleY: scale.y,
          id,
        };
      } else {
        const { id } = state.getCoverByIdx(index);

        return {
          scaleX: 1,
          scaleY: 1,
          id,
        };
      }
    }),
  );
  const points = useAtomValue(pointsAtom);
  const isSelected = useIsSelected(id);
  const showArrow = useShowArrow(id);

  if ((!points && !isSelected) || !showArrow) return null;

  return <CommonDrawArrowChild id={id} scaleX={scaleX} scaleY={scaleY} />;
};

const CommonDrawArrowChild: FC<{
  id: string;
  scaleX: number;
  scaleY: number;
}> = ({ id, scaleX, scaleY }) => {
  const [points, setPoints] = useAtom(pointsAtom);
  const isSelected = useIsSelected(id);
  const selected = useAtomValue(selectedAtom);

  const arrows = useMainStore((state) => state.arrows);
  const addArrow = useMainStore((state) => state.addArrow);
  const updateArrow = useMainStore((state) => state.updateArrow);
  const labelDir = useMainStore((state) => state.configs.arrows.title.dir);
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const cover = useMainStore((state) =>
    selected?.id
      ? state.covers.find((cover) => selected.id === cover.id)
      : undefined,
  );
  const group = useMainStore((state) =>
    selected?.id
      ? state.groups.find((group) => selected.id === group.id)
      : undefined,
  );
  const updateCover = useMainStore((state) => state.updateCover);
  const updateGroup = useMainStore((state) => state.updateGroup);

  const { coverSizeWidth, coverSizeHeight } = useGetSizesContext();
  const selection: PosTypes | null = points?.id === id ? points.dir : null;

  const square = 25 + (coverSizeWidth * scaleX) / 20;

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
      labelDir,
      arrows,
      points,
      setPoints,
      showErrorMessage,
      updateArrow,
    ],
  );

  useEffect(() => {
    if (!isSelected) return;

    const keyFn = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (selection && selection === PosTypes.RIGHT) {
          if (cover) {
            updateCover(cover.id, { pos: { x: cover.pos.x + 1 } });
          } else if (group) {
            updateGroup(group.id, { pos: { x: group.pos.x + 1 } });
          }
        } else {
          handleDrawArrow(id, PosTypes.RIGHT);
        }

        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        if (selection && selection === PosTypes.LEFT) {
          if (cover) {
            updateCover(cover.id, { pos: { x: cover.pos.x - 1 } });
          } else if (group) {
            updateGroup(group.id, { pos: { x: group.pos.x - 1 } });
          }
        } else {
          handleDrawArrow(id, PosTypes.LEFT);
        }
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        if (selection && selection === PosTypes.TOP) {
          if (cover) {
            updateCover(cover.id, { pos: { y: cover.pos.y - 1 } });
          } else if (group) {
            updateGroup(group.id, { pos: { y: group.pos.y - 1 } });
          }
        } else {
          handleDrawArrow(id, PosTypes.TOP);
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (selection && selection === PosTypes.BOTTOM) {
          if (cover) {
            updateCover(cover.id, { pos: { y: cover.pos.y + 1 } });
          } else if (group) {
            updateGroup(group.id, { pos: { y: group.pos.y + 1 } });
          }
        } else {
          handleDrawArrow(id, PosTypes.BOTTOM);
        }
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setPoints(null);
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [
    cover,
    group,
    handleDrawArrow,
    id,
    isSelected,
    selection,
    setPoints,
    updateCover,
    updateGroup,
  ]);

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
      {posArray.map((pos) => (
        <Rect
          key={pos.dir}
          x={pos.x}
          y={pos.y}
          width={pos.width}
          height={pos.height}
          fill={selection === pos.dir ? 'red' : 'white'}
          rotation={45}
          opacity={selection === pos.dir ? 0.3 : 0.05}
          visible={!(!!selection && selection !== pos.dir)}
          onClick={() => handleDrawArrow(id, pos.dir)}
          onTap={() => handleDrawArrow(id, pos.dir)}
          onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
            if (selection !== pos.dir) {
              evt.currentTarget.opacity(0.3);
            }
          }}
          onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
            evt.currentTarget.opacity(selection === pos.dir ? 0.3 : 0.05);
          }}
        />
      ))}
    </Group>
  );
};
