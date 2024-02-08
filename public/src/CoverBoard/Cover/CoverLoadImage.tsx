import React, { useEffect, useState } from 'react';
import { Rect, Text } from 'react-konva';

import { Covers } from 'types';
import { useMainStore } from 'store';
import { CoverImage } from '.';
import { KonvaEventObject } from 'konva/lib/Node';

interface CoverImageProps {
  link: Covers['link'];
  renderTime: number;
}

export const CoverLoadImage: React.FC<CoverImageProps> = ({
  link,
  renderTime,
}) => {
  const color = useMainStore((state) => state.getColor());
  const backColor = useMainStore((state) => state.getBackColor());

  const coverSizeWidth = useMainStore((state) => state.coverSizeWidth());
  const coverSizeHeight = useMainStore((state) => state.coverSizeHeight());
  const fontSize = useMainStore((state) => state.fontSize());

  const [shouldRender, setShouldRender] = useState(false);
  const [hasRetries, setHasRetries] = useState(false);

  const onRetry = (evt: KonvaEventObject<MouseEvent>) => {
    evt.cancelBubble = true;
    setHasRetries(true);
    setShouldRender(false);
  };

  useEffect(() => {
    if (shouldRender) return;

    const timeoutId = setTimeout(
      () => {
        setShouldRender(true);
      },
      hasRetries ? 1000 : renderTime,
    );

    return () => clearTimeout(timeoutId);
  }, [hasRetries, renderTime, shouldRender]);

  return (
    <>
      <Rect
        width={coverSizeWidth - 2}
        height={coverSizeHeight - 2}
        x={1}
        y={1}
        fill={backColor}
        strokeWidth={1}
        stroke={color}
      />
      {shouldRender ? (
        <CoverImage link={link} onRetry={onRetry} />
      ) : (
        <Text
          fontSize={fontSize * 1.2}
          x={0}
          y={coverSizeHeight / 2 - (fontSize * 1.2) / 2}
          width={coverSizeWidth}
          align="center"
          fill={color}
          text="Loading..."
        />
      )}
    </>
  );
};
