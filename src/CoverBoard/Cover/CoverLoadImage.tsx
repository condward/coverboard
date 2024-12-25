import { FC, useEffect, useState } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useSetAtom } from 'jotai';

import { CoverSchema } from 'types';
import { selectedAtom, useIsSelected, useMainStore } from 'store';
import { useGetSizesContext } from 'providers';

import { CoverImage } from '.';

interface CoverImageProps {
  id: CoverSchema['id'];
  link: CoverSchema['link'];
  renderTime: number;
}

export const CoverLoadImage: FC<CoverImageProps> = ({
  id,
  link,
  renderTime,
}) => {
  const color = useMainStore((state) => state.getColor());
  const backColor = useMainStore((state) => state.getBackColor());
  const { fontSize, coverSizeWidth, coverSizeHeight } = useGetSizesContext();

  const setSelected = useSetAtom(selectedAtom);
  const isSelected = useIsSelected(id);

  const refreshCovers = useMainStore((state) => state.refreshCovers);
  const handleSelect = () => {
    setSelected({ id, open: isSelected });
    refreshCovers(id);
  };

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
    <Group onClick={handleSelect} onTap={handleSelect}>
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
    </Group>
  );
};
