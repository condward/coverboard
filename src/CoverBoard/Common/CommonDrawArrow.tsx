import { FC, useCallback, useEffect } from 'react';
import { Group, Rect } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useAtom, useAtomValue } from 'jotai';
import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { PosTypes } from 'types';
import {
  useShallowMainStore,
  pointsAtom,
  useGetSelectedId,
  useToastStore,
} from 'store';
import { useGetSizesContext } from 'providers';

interface CommonDrawArrowProps {
  index: number;
  type: 'cover' | 'group';
}

const useShowArrow = (id: string) => {
  const {
    getCovers,
    getGroups,
    getGroupsOfCover,
    getGroupsOfGroup,
    getGroupsInsideGroup,
    getCoversInsideGroup,
  } = useShallowMainStore((state) => ({
    getCovers: state.getCovers,
    getGroups: state.getGroups,
    getGroupsOfCover: state.getGroupsOfCover,
    getGroupsOfGroup: state.getGroupsOfGroup,
    getGroupsInsideGroup: state.getGroupsInsideGroup,
    getCoversInsideGroup: state.getCoversInsideGroup,
  }));
  const covers = getCovers();
  const groups = getGroups();

  const points = useAtomValue(pointsAtom);

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
  const { id, scaleX, scaleY } = useShallowMainStore((state) => {
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
  });
  const points = useAtomValue(pointsAtom);
  const isSelected = useGetSelectedId(id);
  const showArrow = useShowArrow(id);

  if ((!points && !isSelected) || !showArrow) return null;

  return <CommonDrawArrowChild id={id} scaleX={scaleX} scaleY={scaleY} />;
};

const CommonDrawArrowChild: FC<{
  id: string;
  scaleX: number;
  scaleY: number;
}> = ({ id, scaleX, scaleY }) => {
  const { coverSizeWidth, coverSizeHeight } = useGetSizesContext();

  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const {
    arrows,
    addArrow,
    updateArrow,
    labelDir,
    updateCover,
    updateGroup,
    groups,
    covers,
  } = useShallowMainStore((state) => {
    return {
      arrows: state.arrows,
      groups: state.groups,
      covers: state.covers,
      addArrow: state.addArrow,
      updateArrow: state.updateArrow,
      labelDir: state.configs.arrows.title.dir,
      updateCover: state.updateCover,
      updateGroup: state.updateGroup,
    };
  });

  const [points, setPoints] = useAtom(pointsAtom);
  const selectedId = useGetSelectedId(id);
  const group = selectedId
    ? groups.find((group) => selectedId === group.id)
    : undefined;
  const cover = selectedId
    ? covers.find((cover) => selectedId === cover.id)
    : undefined;

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
    if (!selectedId) return;

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
    selectedId,
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
