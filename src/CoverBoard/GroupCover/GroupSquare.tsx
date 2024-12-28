import { FC, useRef, useEffect } from 'react';
import { Group, Rect, Transformer } from 'react-konva';

import Konva from 'konva';
import { useSetAtom } from 'jotai';

import { useShallowMainStore, useGetSelectedId, selectedAtom } from 'store';
import { useGetSizesContext } from 'providers';
import { KeyboardShortcuts } from 'types';

interface CoverImageProps {
  index: number;
}

export const GroupSquare: FC<CoverImageProps> = ({ index }) => {
  const {
    scaleX,
    scaleY,
    id,
    color,
    groupBackColor,
    updateGroupScale,
    removeCoverAndRelatedArrows,
    removeGroupAndRelatedArrows,
    refreshGroups,
    getCovers,
    getGroups,
  } = useShallowMainStore((state) => {
    const {
      scale: { x: scaleX, y: scaleY },
      id,
    } = state.getGroupByIdx(index);

    return {
      scaleX,
      scaleY,
      id,
      color: state.getGroupColor(),
      groupBackColor: state.getGroupBackColor(),
      updateGroupScale: state.updateGroupScale,
      removeCoverAndRelatedArrows: state.removeCoverAndRelatedArrows,
      removeGroupAndRelatedArrows: state.removeGroupAndRelatedArrows,
      refreshGroups: state.refreshGroups,
      getCovers: state.getCovers,
      getGroups: state.getGroups,
    };
  });
  const selectedId = useGetSelectedId(id);

  const boxRef = useRef<null | { width: number; height: number }>(null);

  const { coverSizeWidth, coverSizeHeight } = useGetSizesContext();
  const coverSizeWidthScaled = coverSizeWidth * scaleX;
  const coverSizeHeightScaled = coverSizeHeight * scaleY;

  const setSelected = useSetAtom(selectedAtom);

  const handlesSelect = () => {
    setSelected({ id, open: !!selectedId });
    refreshGroups(id);
  };

  const rectRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (trRef.current && rectRef.current && selectedId) {
      trRef.current.nodes([rectRef.current]);
    }
  }, [selectedId, removeCoverAndRelatedArrows]);

  useEffect(() => {
    if (!selectedId) return;

    const keyFn = (e: KeyboardEvent) => {
      if (
        e.key === 'Delete' ||
        (e.key as KeyboardShortcuts) === KeyboardShortcuts.DELETE
      ) {
        removeGroupAndRelatedArrows(selectedId);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setSelected(null);
        e.preventDefault();
      } else if (e.key === 'Enter') {
        setSelected({ id: selectedId, open: true });
        e.preventDefault();
      } else if ((e.key as KeyboardShortcuts) === KeyboardShortcuts.NEXT) {
        const groups = getGroups();
        const covers = getCovers();
        if (index > -1 && Boolean(groups[index - 1])) {
          setSelected({
            id: groups[index - 1].id,
            open: false,
          });
          e.preventDefault();
        } else if (covers.length > 0) {
          setSelected({
            id: covers[covers.length - 1].id,
            open: false,
          });
          e.preventDefault();
        } else {
          setSelected({
            id: groups[groups.length - 1].id,
            open: false,
          });
          e.preventDefault();
        }
      } else if ((e.key as KeyboardShortcuts) === KeyboardShortcuts.PREV) {
        const groups = getGroups();
        if (index > -1 && Boolean(groups[index + 1])) {
          setSelected({
            id: groups[index + 1].id,
            open: false,
          });
          e.preventDefault();
        } else {
          setSelected({ id: groups[0].id, open: false });
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', keyFn);

    return () => window.removeEventListener('keydown', keyFn);
  }, [
    getCovers,
    getGroups,
    index,
    selectedId,
    removeGroupAndRelatedArrows,
    setSelected,
  ]);

  const handleTransform = () => {
    if (rectRef.current && boxRef.current) {
      const scaleX =
        Math.round(boxRef.current.width / coverSizeWidth / 0.5) * 0.5;
      const scaleY =
        Math.round(boxRef.current.height / coverSizeHeight / 0.5) * 0.5;

      rectRef.current.x(0);
      rectRef.current.y(0);
      rectRef.current.scaleX(1);
      rectRef.current.scaleY(1);
      updateGroupScale(id, { scaleX, scaleY });

      boxRef.current = null;
    }
  };

  return (
    <Group onClick={handlesSelect} onTap={handlesSelect}>
      <Rect
        width={coverSizeWidthScaled - 2}
        height={coverSizeHeightScaled - 2}
        x={1}
        y={1}
        strokeWidth={1}
        stroke={color}
        fill={groupBackColor}
        ref={rectRef}
        onTransformEnd={handleTransform}
      />
      {selectedId && (
        <Transformer
          ref={trRef}
          centeredScaling
          boundBoxFunc={(oldBox, newBox) => {
            if (
              Math.abs(newBox.width) < coverSizeWidth ||
              Math.abs(newBox.height) < coverSizeHeight
            ) {
              return oldBox;
            }
            if (
              Math.abs(newBox.width) > coverSizeWidth * 10.5 ||
              Math.abs(newBox.height) > coverSizeHeight * 10.5
            ) {
              return oldBox;
            }

            boxRef.current = { width: newBox.width, height: newBox.height };

            return newBox;
          }}
          flipEnabled={false}
          rotateEnabled={false}
        />
      )}
    </Group>
  );
};
