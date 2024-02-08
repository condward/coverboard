import React, { useRef } from 'react';
import { Rect, Transformer } from 'react-konva';

import { GroupCovers } from 'types';
import { useMainStore, useUtilsStore } from 'store';
import Konva from 'konva';

interface CoverImageProps {
  id: GroupCovers['id'];
  scaleX: number;
  scaleY: number;
}

export const GroupSquare: React.FC<CoverImageProps> = ({
  id,
  scaleX,
  scaleY,
}) => {
  const selected = useUtilsStore((state) => state.selected);
  const color = useMainStore((state) => state.getGroupColor());
  const backColor = useMainStore((state) => state.getBackColor());

  const boxRef = useRef<null | { width: number; height: number }>(null);

  const updateGroupScale = useMainStore((state) => state.updateGroupScale);

  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight());
  const coverSizeWidthScaled = coverSizeWidth * scaleX;
  const coverSizeHeightScaled = coverSizeHeight * scaleY;

  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );

  const rectRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (trRef.current && rectRef.current && selected && selected.id === id) {
      trRef.current.nodes([rectRef.current]);
    }
  }, [id, selected, removeCoverAndRelatedLines]);

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
    <>
      <Rect
        width={coverSizeWidthScaled - 2}
        height={coverSizeHeightScaled - 2}
        x={1}
        y={1}
        strokeWidth={1}
        stroke={color}
        fill={backColor}
        ref={rectRef}
        onTransformEnd={handleTransform}
      />
      {selected && selected.id === id && (
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
    </>
  );
};
