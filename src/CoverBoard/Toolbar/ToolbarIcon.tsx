import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Rect, Text } from 'react-konva';
import { FC } from 'react';
import { useSetAtom } from 'jotai';

import { ToolConfig } from 'types';
import { clearHash, useIsLandscape } from 'utils';
import { pointsAtom, tooltipAtom } from 'store';
import { useGetSizesContext } from 'providers';

const MIN_OPACITY = 0.3;

interface ToolbarIconProps {
  config: ToolConfig;
  index: number;
}

export const ToolbarIcon: FC<ToolbarIconProps> = ({ config, index }) => {
  const setPoints = useSetAtom(pointsAtom);
  const { toolbarIconSize, getCurrentY } = useGetSizesContext();
  const setTooltip = useSetAtom(tooltipAtom);
  const isLandscape = useIsLandscape();

  const handleClick = () => {
    setPoints(null);
    clearHash();

    return config.value
      ? config.valueModifier(false)
      : config.valueModifier(true);
  };

  return (
    <Group
      key={config.id}
      x={
        isLandscape
          ? toolbarIconSize / 2
          : getCurrentY(index) + toolbarIconSize / 2
      }
      y={
        isLandscape
          ? getCurrentY(index) + toolbarIconSize / 2
          : toolbarIconSize / 2
      }
      listening={config.enabled}
      onTap={handleClick}
      onClick={handleClick}
      onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
        setTooltip({
          text: config.tooltip,
          x: evt.evt.clientX,
          y: evt.evt.clientY,
        });
        evt.currentTarget.opacity(0.5);
        const container = evt.target.getStage()?.container();

        if (container) {
          container.style.cursor = 'pointer';
        }
      }}
      onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
        setTooltip(null);
        evt.currentTarget.opacity(1);
        const container = evt.target.getStage()?.container();

        if (container) {
          container.style.cursor = 'default';
        }
      }}>
      <Rect
        width={toolbarIconSize}
        height={toolbarIconSize}
        fill={config.color}
        opacity={config.value ? MIN_OPACITY : 1}
      />
      <Text
        x={1}
        y={toolbarIconSize / 3.5}
        width={toolbarIconSize}
        height={toolbarIconSize}
        align="center"
        text={config.emoji}
        fontSize={toolbarIconSize / 2}
        fill="black"
        opacity={config.value ? MIN_OPACITY : 1}
      />
      <Text
        x={toolbarIconSize / 2 - 1}
        y={toolbarIconSize - toolbarIconSize / 4 - 1}
        width={toolbarIconSize / 2}
        height={toolbarIconSize / 2}
        align="right"
        fontStyle="bold"
        fill={config.color === 'yellow' ? 'gray' : 'white'}
        text={config.badge === null ? '' : String(config.badge)}
        fontSize={toolbarIconSize / 4}
      />
      {config.enabled && (
        <Text
          x={1}
          y={1}
          width={toolbarIconSize / 2}
          height={toolbarIconSize / 2}
          align="left"
          fontStyle="bold"
          fill={config.color === 'yellow' ? 'gray' : 'white'}
          text={config.shortcut}
          fontSize={toolbarIconSize / 4}
        />
      )}
    </Group>
  );
};
