import { FC, RefObject, useCallback, useRef, useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { flushSync } from 'react-dom';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useAtomValue, useSetAtom } from 'jotai';
import { Stack } from '@mui/material';

import { hideToolbarAtom, pointsAtom, selectedAtom, useMainStore } from 'store';
import { formatDate, useIsLandscape, useSaveId } from 'utils';
import { useGetSizesContext } from 'providers';
import { Toolbar, Logo, useCreateGroup } from 'components';

import {
  Covers,
  GroupCovers,
  Arrows,
  TitleLabel,
  BoundaryCoverArrows,
  BoundaryGroupArrows,
  CoverCountLabel,
  GroupCountLabel,
  useKeysListener,
} from './';

export const CoverBoard: FC = () => {
  const color = useMainStore((state) => state.getColor());
  const saveId = useSaveId();
  const isLandscape = useIsLandscape();
  const hideToolbar = useAtomValue(hideToolbarAtom);
  const backColor = useMainStore((state) => state.getBackColor());
  const { canvasLimits, padding } = useGetSizesContext();

  const stageRef: RefObject<Konva.Stage> = useRef(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');

  const setSelected = useSetAtom(selectedAtom);
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

    if (stage) {
      const uri = stage.toDataURL({ ...canvasLimits, mimeType: 'image/png' });

      flushSync(() => {
        setScreenshotUrl(uri);
      });

      const downloadLink = document.createElement('a');
      downloadLink.href = uri;
      downloadLink.download = `${saveId} ${formatDate(new Date())}.png`;
      downloadLink.click();

      flushSync(() => {
        setScreenshotUrl('');
      });
    }
  }, [canvasLimits, saveId]);
  useKeysListener({ createGroup, takeScreenshot });

  return (
    <Stack
      direction={isLandscape ? 'row' : 'column'}
      gap={`${padding}px`}
      sx={{
        overflowY: isLandscape ? 'hidden' : undefined,
        overflowX: !isLandscape ? 'hidden' : undefined,
      }}>
      {!hideToolbar && (
        <Stack
          maxHeight={isLandscape ? canvasLimits.height : undefined}
          maxWidth={!isLandscape ? canvasLimits.width : undefined}
          justifyContent="space-between"
          alignItems="center"
          direction={isLandscape ? 'column' : 'row'}>
          <Toolbar takeScreenshot={takeScreenshot} createGroup={createGroup} />
          <Logo />
        </Stack>
      )}
      <Stack border={`3px solid ${color}`}>
        <Stage
          width={canvasLimits.width}
          height={canvasLimits.height}
          ref={stageRef}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}>
          <Layer>
            {screenshotUrl && (
              <Rect
                listening={false}
                width={canvasLimits.width}
                height={canvasLimits.height}
                fill={backColor}
                stroke={color}
              />
            )}
            <GroupCovers />
            <Arrows />
            <Covers />
            <TitleLabel />
            <BoundaryCoverArrows />
            <BoundaryGroupArrows />
            <CoverCountLabel />
            <GroupCountLabel />
          </Layer>
        </Stage>
      </Stack>

      {screenshotUrl && <img src={screenshotUrl} alt="Screenshot" />}
    </Stack>
  );
};
