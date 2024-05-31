import { FC, useRef, useEffect } from 'react';
import { Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import { useAtomValue } from 'jotai';

import { GroupSchema } from 'types';
import { useMainStore, selectedAtom } from 'store';

interface CoverImageProps {
  id: GroupSchema['id'];
  scaleX: GroupSchema['scaleX'];
  scaleY: GroupSchema['scaleY'];
}

export const GroupSquare: FC<CoverImageProps> = ({ id, scaleX, scaleY }) => {
  const selected = useAtomValue(selectedAtom);
  const color = useMainStore((state) => state.getGroupColor());
  const backColor = useMainStore((state) => state.getBackColor());

  const boxRef = useRef<null | { width: number; height: number }>(null);

  const updateGroupScale = useMainStore((state) => state.updateGroupScale);

  const coverSizeWidth = useMainStore((state) => state.getCoverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.getCoverSizeHeight());
  const coverSizeWidthScaled = coverSizeWidth * scaleX;
  const coverSizeHeightScaled = coverSizeHeight * scaleY;

  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );

  const rectRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
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
