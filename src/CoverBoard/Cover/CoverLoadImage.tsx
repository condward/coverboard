import { FC, useEffect, useState } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useSetAtom } from 'jotai';

import { KeyboardShortcuts } from 'types';
import { selectedAtom, useGetSelectedId, useShallowMainStore } from 'store';
import { useGetSizesContext } from 'providers';

import { CoverImage } from '.';

export const CoverLoadImage: FC<{
  index: number;
}> = ({ index }) => {
  const renderTime = 400 * index;

  const {
    link,
    id,
    color,
    backColor,
    refreshCovers,
    removeCoverAndRelatedArrows,
    getGroups,
    getCovers,
  } = useShallowMainStore((state) => {
    const { link, id } = state.getCoverByIdx(index);

    return {
      link,
      id,
      color: state.getColor(),
      backColor: state.getBackColor(),
      refreshCovers: state.refreshCovers,
      removeCoverAndRelatedArrows: state.removeCoverAndRelatedArrows,
      getGroups: state.getGroups,
      getCovers: state.getCovers,
    };
  });
  const { fontSize, coverSizeWidth, coverSizeHeight } = useGetSizesContext();

  const selectedId = useGetSelectedId(id);
  const setSelected = useSetAtom(selectedAtom);

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

  useEffect(() => {
    if (!selectedId) return;

    const keyFn = (e: KeyboardEvent) => {
      if (
        e.key === 'Delete' ||
        (e.key as KeyboardShortcuts) === KeyboardShortcuts.DELETE
      ) {
        removeCoverAndRelatedArrows(selectedId);
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
        if (index > -1 && Boolean(covers[index - 1])) {
          setSelected({
            id: covers[index - 1].id,
            open: false,
          });
          e.preventDefault();
        } else if (groups.length > 0) {
          setSelected({
            id: groups[groups.length - 1].id,
            open: false,
          });
          e.preventDefault();
        } else {
          setSelected({
            id: covers[covers.length - 1].id,
            open: false,
          });
          e.preventDefault();
        }
      } else if ((e.key as KeyboardShortcuts) === KeyboardShortcuts.PREV) {
        const covers = getCovers();
        if (index > -1 && Boolean(covers[index + 1])) {
          setSelected({
            id: covers[index + 1].id,
            open: false,
          });
          e.preventDefault();
        } else {
          setSelected({ id: covers[0].id, open: false });
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
    removeCoverAndRelatedArrows,
    setSelected,
  ]);

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
