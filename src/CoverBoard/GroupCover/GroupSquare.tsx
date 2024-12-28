import { FC, useRef, useEffect } from 'react';
import { Group, Rect, Transformer } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import Konva from 'konva';
import { useSetAtom } from 'jotai';

import { useMainStore, useIsSelected, selectedAtom } from 'store';
import { useGetSizesContext } from 'providers';

interface CoverImageProps {
  index: number;
}

export const GroupSquare: FC<CoverImageProps> = ({ index }) => {
  const { scaleX, scaleY, id } = useMainStore(
    useShallow((state) => {
      const {
        scale: { x: scaleX, y: scaleY },
        id,
      } = state.getGroupByIdx(index);

      return {
        scaleX,
        scaleY,
        id,
      };
    }),
  );

  const isSelected = useIsSelected(id);
  const color = useMainStore((state) => state.getGroupColor());
  const groupBackColor = useMainStore((state) => state.getGroupBackColor());

  const boxRef = useRef<null | { width: number; height: number }>(null);

  const updateGroupScale = useMainStore((state) => state.updateGroupScale);

  const { coverSizeWidth, coverSizeHeight } = useGetSizesContext();
  const coverSizeWidthScaled = coverSizeWidth * scaleX;
  const coverSizeHeightScaled = coverSizeHeight * scaleY;

  const removeCoverAndRelatedArrows = useMainStore(
    (state) => state.removeGroupAndRelatedArrows,
  );

  const setSelected = useSetAtom(selectedAtom);
  const refreshGroups = useMainStore((state) => state.refreshGroups);

  const handlesSelect = () => {
    setSelected({ id, open: isSelected });
    refreshGroups(id);
  };

  const rectRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (trRef.current && rectRef.current && isSelected) {
      trRef.current.nodes([rectRef.current]);
    }
  }, [isSelected, removeCoverAndRelatedArrows]);

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
      {isSelected && (
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
