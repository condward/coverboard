import React, { useCallback, useEffect, useMemo } from 'react';
import { Group, Rect } from 'react-konva';

import { Covers, PosTypes } from 'types';
import { KonvaEventObject } from 'konva/lib/Node';
import { useUtilsStore, useMainStore } from 'store';

interface CommonDrawLineProps {
  id: Covers['id'];
  scaleX?: number;
  scaleY?: number;
}

export const CommonDrawLine: React.FC<CommonDrawLineProps> = ({
  id,
  scaleX = 1,
  scaleY = 1,
}) => {
  const points = useUtilsStore((state) => state.points);
  const setPoints = useUtilsStore((state) => state.setPoints);
  const createLine = useMainStore((state) => state.createLine);
  const isSelected = useUtilsStore((state) => state.isSelected({ id }));

  const groups = useMainStore((state) => state.groups);
  const covers = useMainStore((state) => state.covers);
  const getGroupsOfCover = useMainStore((state) => state.getGroupsOfCover);
  const getGroupsOfGroup = useMainStore((state) => state.getGroupsOfGroup);
  const getGroupsInsideGroup = useMainStore(
    (state) => state.getGroupsInsideGroup,
  );
  const getCoversInsideGroup = useMainStore(
    (state) => state.getCoversInsideGroup,
  );

  const showArrow = useMemo(() => {
    if (points) {
      const cover = covers.find((cover) => cover.id === points.id);
      if (cover) {
        return !getGroupsOfCover(cover.id).find((val) => val.id === id);
      }

      const group = groups.find((group) => group.id === points.id);
      if (group) {
        return !(
          !!getGroupsOfGroup(group.id).find((val) => val.id === id) ||
          !!getGroupsInsideGroup(group.id).find((val) => val.id === id) ||
          !!getCoversInsideGroup(group.id).find((val) => val.id === id)
        );
      }
    }
    return true;
  }, [
    covers,
    getCoversInsideGroup,
    getGroupsInsideGroup,
    getGroupsOfCover,
    getGroupsOfGroup,
    groups,
    id,
    points,
  ]);

  const coverSizeWidth =
    useMainStore((state) => state.coverSizeWidth()) * scaleX;
  const coverSizeHeight =
    useMainStore((state) => state.coverSizeHeight()) * scaleY;
  const selection: PosTypes | null = points?.id === id ? points.dir : null;

  const square = 25 + coverSizeWidth / 20;

  const handleDrawLine = useCallback(
    (id: string, dir: PosTypes) => {
      if (!points) {
        setPoints({ id, dir });
      } else if (points.id !== id) {
        createLine(id, points, dir);
        setPoints(null);
      } else if (points.id === id) {
        setPoints(null);
      }
    },
    [createLine, points, setPoints],
  );

  const posArray = [
    {
      dir: PosTypes.TOP,
      x: coverSizeWidth / 2,
      y: -square / 1.5,
      width: square,
      height: square,
    },
    {
      dir: PosTypes.RIGHT,
      x: coverSizeWidth,
      y: coverSizeHeight / 2 - square / 1.5,
      width: square,
      height: square,
    },
    {
      dir: PosTypes.LEFT,
      x: 0,
      y: coverSizeHeight / 2 - square / 1.5,
      width: square,
      height: square,
    },
    {
      dir: PosTypes.BOTTOM,
      x: coverSizeWidth / 2,
      y: coverSizeHeight - square / 1.5,
      width: square,
      height: square,
    },
  ];

  useEffect(() => {
    if (!isSelected) return;

    const keyFn = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleDrawLine(id, PosTypes.RIGHT);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        handleDrawLine(id, PosTypes.LEFT);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        handleDrawLine(id, PosTypes.TOP);
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        handleDrawLine(id, PosTypes.BOTTOM);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setPoints(null);
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [handleDrawLine, id, isSelected, setPoints]);

  if ((!points && !isSelected) || !showArrow) return null;

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
          onClick={() => handleDrawLine(id, pos.dir)}
          onTap={() => handleDrawLine(id, pos.dir)}
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
