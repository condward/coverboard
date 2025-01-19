import { Box, Button, Tooltip } from '@mui/material';
import { FC, memo, useCallback } from 'react';
import { useSetAtom } from 'jotai';

import { ToolConfig } from 'types';
import { clearHash } from 'utils';
import { pointsAtom } from 'store';
import { useGetSizesContext } from 'providers';
import { ToobarKeyboardListener } from 'CoverBoard/Keyboard';

const MIN_OPACITY = 0.3;

interface ToolbarIconProps {
  config: ToolConfig;
  index: number;
}

const ToolbarIconWithoutMemo: FC<ToolbarIconProps> = ({ config }) => {
  const { coverSizeWidth, fontSize } = useGetSizesContext();

  const setPoints = useSetAtom(pointsAtom);

  const handleClick = useCallback(() => {
    setPoints(null);
    clearHash();

    if (!config.enabled) return;

    return config.value
      ? config.valueModifier(false)
      : config.valueModifier(true);
  }, [config, setPoints]);

  return (
    <>
      {config.enabled && (
        <ToobarKeyboardListener
          shortcut={config.shortcut}
          onKeyPress={handleClick}
        />
      )}
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

export const ToolbarIcon = memo(ToolbarIconWithoutMemo);
