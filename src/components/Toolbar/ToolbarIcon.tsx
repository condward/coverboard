import { Box, Button, Tooltip } from '@mui/material';
import { FC, useCallback, useEffect } from 'react';
import { useSetAtom } from 'jotai';

import { KeyboardShortcuts, ToolConfig } from 'types';
import { clearHash, usePreventKeys } from 'utils';
import { pointsAtom } from 'store';
import { useGetSizesContext } from 'providers';

const MIN_OPACITY = 0.3;

interface ToolbarIconProps {
  config: ToolConfig;
  index: number;
}

export const ToolbarIcon: FC<ToolbarIconProps> = ({ config }) => {
  const setPoints = useSetAtom(pointsAtom);
  const { coverSizeWidth, fontSize } = useGetSizesContext();
  const preventKeys = usePreventKeys();

  const handleClick = useCallback(() => {
    setPoints(null);
    clearHash();

    return config.value
      ? config.valueModifier(false)
      : config.valueModifier(true);
  }, [config, setPoints]);

  useEffect(() => {
    if (preventKeys) return;

    const keyFn = (e: KeyboardEvent) => {
      if ((e.key as KeyboardShortcuts) === config.shortcut) {
        handleClick();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', keyFn);

    return () => window.removeEventListener('keydown', keyFn);
  }, [config.shortcut, handleClick, preventKeys]);

  return (
    <>
      <Tooltip title={config.tooltip} key={config.id}>
        <Button
          onClick={handleClick}
          sx={{
            minWidth: 0,
            padding: 0,
            margin: 0,
            opacity: config.value ? MIN_OPACITY : 1,
            width: coverSizeWidth / 2,
            height: coverSizeWidth / 2,
            backgroundColor: config.color,
            color: config.color === '#FFFF00' ? 'gray' : 'white',
            fontSize: `${fontSize / 10}rem`,
          }}>
          {config.icon}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              margin: 0,
              px: 0.1,
              fontSize: `${fontSize / 20}rem`,
            }}>
            {config.shortcut.toUpperCase()}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              margin: 0,
              px: 0.1,
              fontSize: `${fontSize / 20}rem`,
            }}>
            {config.badge === null
              ? ''
              : String(config.badge).replace('0.', '.')}
          </Box>
        </Button>
      </Tooltip>
    </>
  );
};
