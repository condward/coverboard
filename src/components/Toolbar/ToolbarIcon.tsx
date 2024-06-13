import { Box, Button, Stack, Tooltip } from '@mui/material';
import { FC } from 'react';
import { useSetAtom } from 'jotai';

import { ToolConfig } from 'types';
import { clearHash } from 'utils';
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

  const handleClick = () => {
    setPoints(null);
    clearHash();

    return config.value
      ? config.valueModifier(false)
      : config.valueModifier(true);
  };

  return (
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
          color: config.color === 'yellow' ? 'red' : 'white',

          fontSize: `${fontSize / 10}rem`,
        }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            margin: 0,
            px: 0.2,
            fontSize: `${fontSize / 17}rem`,
          }}>
          {config.shortcut}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            margin: 0,
            px: 0.2,
            fontSize: `${fontSize / 17}rem`,
          }}>
          {config.badge === null ? '' : String(config.badge)}
        </Box>
        <Stack>{config.emoji}</Stack>
      </Button>
    </Tooltip>
  );
};
