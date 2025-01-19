import { FC, useCallback, useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useAtomValue, useSetAtom } from 'jotai';
import { Stack } from '@mui/material';

import {
  hideToolbarAtom,
  pointsAtom,
  selectedAtom,
  useShallowMainStore,
} from 'store';
import { formatDate, useIsLandscape, useSaveId } from 'utils';
import { useGetSizesContext } from 'providers';
import { Toolbar, Logo } from 'components';

import {
  Covers,
  GroupCovers,
  Arrows,
  TitleLabel,
  MainKeyboardListener,
  BoundaryCoverArrows,
  BoundaryGroupArrows,
  CoverCountLabel,
  GroupCountLabel,
} from './';

export const CoverBoard: FC = () => {
  const isLandscape = useIsLandscape();
  const saveId = useSaveId();

  const { canvasLimits, padding } = useGetSizesContext();

  const { color, backColor } = useShallowMainStore((state) => ({
    color: state.getColor(),
    backColor: state.getBackColor(),
  }));

  const { hideToolbar, setSelected, setPoints } = {
    hideToolbar: useAtomValue(hideToolbarAtom),
    setSelected: useSetAtom(selectedAtom),
    setPoints: useSetAtom(pointsAtom),
  };

  const [screenshot, setScreenshot] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');

  const checkDeselect = useCallback(
    (e: KonvaEventObject<MouseEvent | Event>) => {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelected(null);
        setPoints(null);
      }
    },
    [setPoints, setSelected],
  );

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
          <Toolbar takeScreenshot={() => setScreenshot(true)} />
          <Logo />
        </Stack>
      )}
      <MainKeyboardListener />
      <Stack border={`3px solid ${color}`}>
        <Stage
          width={canvasLimits.width}
          height={canvasLimits.height}
          ref={(stage) => {
            if (stage && screenshot) {
              setScreenshotUrl(
                stage.toDataURL({
                  ...canvasLimits,
                  mimeType: 'image/png',
                }),
              );
              setScreenshot(false);
            }
          }}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}>
          <Layer>
            <Rect
              listening={false}
              width={canvasLimits.width}
              height={canvasLimits.height}
              fill={backColor}
              stroke={color}
            />

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

      {screenshotUrl && (
        <img
          ref={(node) => {
            if (node) {
              const downloadLink = document.createElement('a');
              downloadLink.href = screenshotUrl;
              downloadLink.download = `${saveId} ${formatDate(new Date())}.png`;
              downloadLink.click();

              setScreenshotUrl('');
            }
          }}
          src={screenshotUrl}
          alt="Screenshot"
        />
      )}
    </Stack>
  );
};
