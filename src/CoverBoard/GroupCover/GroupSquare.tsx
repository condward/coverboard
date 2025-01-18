import { FC, useRef } from 'react';
import { Group, Rect, Transformer } from 'react-konva';

import Konva from 'konva';
import { useSetAtom } from 'jotai';

import { useShallowMainStore, useGetSelectedId, selectedAtom } from 'store';
import { useGetSizesContext } from 'providers';
interface CoverImageProps {
  index: number;
}

export const GroupSquare: FC<CoverImageProps> = ({ index }) => {
  const { coverSizeWidth, coverSizeHeight } = useGetSizesContext();

  const {
    scaleX,
    scaleY,
    id,
    color,
    groupBackColor,
    updateGroupScale,
    refreshGroups,
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
      refreshGroups: state.refreshGroups,
    };
  });

  const setSelected = useSetAtom(selectedAtom);
  const selectedId = useGetSelectedId(id);

  const boxRef = useRef<null | { width: number; height: number }>(null);
  const rectRef = useRef<Konva.Rect>(null);

  const coverSizeWidthScaled = coverSizeWidth * scaleX;
  const coverSizeHeightScaled = coverSizeHeight * scaleY;

  const handlesSelect = () => {
    setSelected({ id, open: !!selectedId });
    refreshGroups(id);
  };

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
          ref={(node) => {
            if (node && rectRef.current) {
              node.nodes([rectRef.current]);
            }
          }}
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
