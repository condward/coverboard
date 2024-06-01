import { FC, RefObject, memo, useCallback, useRef, useState } from 'react';
import { Stage, Layer, Group, Rect } from 'react-konva';
import { flushSync } from 'react-dom';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import {
  hideToolbarAtom,
  pointsAtom,
  selectedAtom,
  sizeAtom,
  toolbarDragAtom,
  useMainStore,
} from 'store';
import { formatDate, useIsLandscape, useSaveId } from 'utils';
import { useGetSizesContext } from 'providers';

import {
  Covers,
  GroupCovers,
  Lines,
  Toolbar,
  TitleLabel,
  BoundaryCoverArrows,
  BoundaryGroupArrows,
  CoverCountLabel,
  GroupCountLabel,
  Logo,
  useKeysListener,
} from './';
import { useCreateGroup } from './Toolbar/useCreateGroup';

export const CoverBoardWithoutMemo: FC = () => {
  const color = useMainStore((state) => state.getColor());
  const backColor = useMainStore((state) => state.getBackColor());
  const saveId = useSaveId();
  const isLandscape = useIsLandscape();

  const windowSize = useAtomValue(sizeAtom);
  const { dragLimits, toolbarLimits, stageLimits, toolbarIconSize } =
    useGetSizesContext();
  const isToolbarHidden = useAtomValue(hideToolbarAtom);

  const stageRef: RefObject<Konva.Stage> = useRef(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [showLogo, setShowLogo] = useState(true);

  const setSelected = useSetAtom(selectedAtom);
  const [toolbarDrag, setToolbarDrag] = useAtom(toolbarDragAtom);
  const setPoints = useSetAtom(pointsAtom);
  const checkDeselect = (e: KonvaEventObject<MouseEvent | Event>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelected(null);
      setPoints(null);
    }
  };

  const { createGroup } = useCreateGroup();
  const takeScreenshot = useCallback(() => {
    const stage = stageRef.current;

    flushSync(() => {
      setShowLogo(false);
    });

    if (stage) {
      const uri = stage.toDataURL({ ...dragLimits, mimeType: 'image/png' });

      flushSync(() => {
        setScreenshotUrl(uri);
      });

      const downloadLink = document.createElement('a');
      downloadLink.href = uri;
      downloadLink.download = `${saveId} ${formatDate(new Date())}.png`;
      downloadLink.click();

      flushSync(() => {
        setScreenshotUrl('');
        setShowLogo(true);
      });
    }
  }, [dragLimits, saveId]);
  useKeysListener({ createGroup, takeScreenshot });

  return (
    <>
      <Stage
        width={stageLimits.width}
        height={stageLimits.height}
        ref={stageRef}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}>
        <Layer>
          {!showLogo && (
            <Rect
              name="screenshotBackground"
              width={windowSize.width}
              height={windowSize.height}
              fill={backColor}
              listening={false}
            />
          )}
          <Group name="board" x={dragLimits.x} y={dragLimits.y}>
            <GroupCovers />
            <Lines />
            <Covers />
            <TitleLabel />
            <BoundaryCoverArrows />
            <BoundaryGroupArrows />
            <CoverCountLabel />
            <GroupCountLabel />

            <Rect
              name="arenaBorder"
              x={1}
              y={1}
              width={dragLimits.width - 2}
              height={dragLimits.height - 2}
              stroke={color}
              listening={false}
            />
          </Group>
          {!isToolbarHidden && (
            <Group
              name="toolbar"
              x={toolbarLimits.x}
              y={toolbarLimits.y}
              draggable
              onDragStart={(e) => {
                e.currentTarget.opacity(0.5);
                setToolbarDrag(true);
              }}
              onDragMove={(e) => {
                e.cancelBubble = true;
                const targetX = Math.round(e.target.x());
                const targetY = Math.round(e.target.y());

                if (targetY < 0 || targetX < 0) {
                  setToolbarDrag(false);
                  e.currentTarget.position({ x: 0, y: 0 });
                }
              }}
              onDragEnd={(e) => {
                e.currentTarget.opacity(1);
              }}>
              {showLogo &&
                !toolbarDrag &&
                (isLandscape
                  ? toolbarLimits.height <
                    stageLimits.height - 2.5 * toolbarIconSize
                  : toolbarLimits.width <
                    stageLimits.width - 10 * toolbarIconSize) && <Logo />}
              <Rect
                name="toolbarBorder"
                fill={backColor}
                x={1}
                y={1}
                width={
                  (isLandscape ? toolbarLimits.width : toolbarLimits.height) - 2
                }
                height={
                  (isLandscape ? toolbarLimits.height : toolbarLimits.width) - 2
                }
                stroke={color}
              />
              <Toolbar
                takeScreenshot={takeScreenshot}
                showTooltips={showLogo}
                createGroup={createGroup}
              />
            </Group>
          )}
        </Layer>
      </Stage>
      {screenshotUrl && <img src={screenshotUrl} alt="Screenshot" />}
    </>
  );
};

export const CoverBoard = memo(CoverBoardWithoutMemo);
