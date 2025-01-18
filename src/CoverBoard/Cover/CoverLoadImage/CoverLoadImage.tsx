import { FC, useEffect, useState } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useSetAtom } from 'jotai';

import { selectedAtom, useGetSelectedId, useShallowMainStore } from 'store';
import { useGetSizesContext } from 'providers';

import { CoverImage } from '.';

export const CoverLoadImage: FC<{
  index: number;
}> = ({ index }) => {
  const renderTime = 400 * index;

  const { fontSize, coverSizeWidth, coverSizeHeight } = useGetSizesContext();

  const { link, id, color, backColor, refreshCovers } = useShallowMainStore(
    (state) => {
      const { link, id } = state.getCoverByIdx(index);

      return {
        link,
        id,
        color: state.getColor(),
        backColor: state.getBackColor(),
        refreshCovers: state.refreshCovers,
      };
    },
  );

  const setSelected = useSetAtom(selectedAtom);
  const selectedId = useGetSelectedId(id);

  const [shouldRender, setShouldRender] = useState(false);
  const [hasRetries, setHasRetries] = useState(false);

  const handleSelect = () => {
    setSelected({ id, open: !!selectedId });
    refreshCovers(id);
  };

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
