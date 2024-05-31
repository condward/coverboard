import { FC, RefObject, memo, useRef, useState } from 'react';
import { Stage, Layer, Group, Rect } from 'react-konva';
import { flushSync } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useSetAtom } from 'jotai';

import { pointsAtom, selectedAtom, useMainStore } from 'store';
import { formatDate, useSaveId } from 'utils';

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
} from './';

export const CoverBoardWithoutMemo: FC = () => {
  const color = useMainStore((state) => state.getColor());
  const backColor = useMainStore((state) => state.getBackColor());
  const saveId = useSaveId();

  const toolBarLimits = useMainStore(
    useShallow((state) => state.getToolBarLimits()),
  );
  const toobarIconSize = useMainStore((state) => state.getToobarIconSize());
  const windowSize = useMainStore((state) => state.windowSize);
  const dragLimits = useMainStore(useShallow((state) => state.getDragLimits()));

  const stageRef: RefObject<Konva.Stage> = useRef(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [showLogo, setShowLogo] = useState(true);

  const setSelected = useSetAtom(selectedAtom);
  const setPoints = useSetAtom(pointsAtom);
  const checkDeselect = (e: KonvaEventObject<MouseEvent | Event>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelected(null);
      setPoints(null);
    }
  };

  const takeScreenshot = () => {
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
  };

  return (
    <>
      <Stage
        width={windowSize.width - toobarIconSize}
        height={windowSize.height - toobarIconSize}
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
          <Rect
            name="leftBackground"
            width={2.5 * toobarIconSize}
            height={windowSize.height - toobarIconSize}
            fill={backColor}
            listening={false}
          />
          <Group name="toolbar" x={toolBarLimits.x} y={toolBarLimits.y}>
            {showLogo && <Logo />}
            <Rect
              name="toolbarBorder"
              x={1}
              y={1}
              width={toolBarLimits.width - 2}
              height={toolBarLimits.height - 2}
              stroke={color}
            />
            <Toolbar takeScreenshot={takeScreenshot} showTooltips={showLogo} />
          </Group>
        </Layer>
      </Stage>
      {screenshotUrl && <img src={screenshotUrl} alt="Screenshot" />}
    </>
  );
};

export const CoverBoard = memo(CoverBoardWithoutMemo);
