import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Rect, Text } from 'react-konva';

import { ToolConfig } from 'types';
import { clearHash } from 'utils';
import { useMainStore, useToolbarStore, useUtilsStore } from 'store';

const MIN_OPACITY = 0.3;

interface ToolbarIconProps {
  config: ToolConfig;
  index: number;
}

export const ToolbarIcon: React.FC<ToolbarIconProps> = ({ config, index }) => {
  const setPoints = useUtilsStore((state) => state.setPoints);
  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const getCurrentY = useMainStore((state) => state.getCurrentY);
  const setTooltip = useToolbarStore((state) => state.setTooltip);

  const handleMouseMove = (evt: KonvaEventObject<MouseEvent>, tip: string) => {
    setTooltip({
      text: tip,
      x: evt.evt.clientX,
      y: evt.evt.clientY,
    });
  };

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
      x={toobarIconSize / 2}
      y={getCurrentY(index) + toobarIconSize / 2}
      listening={config.enabled}
      onTap={handleClick}
      onClick={handleClick}
      onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
        handleMouseMove(evt, config.tooltip);
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
        width={toobarIconSize}
        height={toobarIconSize}
        fill={config.color}
        opacity={config.value ? MIN_OPACITY : 1}
      />
      <Text
        x={1}
        y={toobarIconSize / 3.5}
        width={toobarIconSize}
        height={toobarIconSize}
        align="center"
        text={config.emoji}
        fontSize={toobarIconSize / 2}
        fill="black"
        opacity={config.value ? MIN_OPACITY : 1}
      />
      <Text
        x={toobarIconSize / 2 - 1}
        y={toobarIconSize - toobarIconSize / 4 - 1}
        width={toobarIconSize / 2}
        height={toobarIconSize / 2}
        align="right"
        fontStyle="bold"
        fill={config.color === 'yellow' ? 'gray' : 'white'}
        text={config.badge ? String(config.badge) : ''}
        fontSize={toobarIconSize / 4}
      />
      {config.enabled && (
        <Text
          x={1}
          y={1}
          width={toobarIconSize / 2}
          height={toobarIconSize / 2}
          align="left"
          fontStyle="bold"
          fill={config.color === 'yellow' ? 'gray' : 'white'}
          text={config.shortcut}
          fontSize={toobarIconSize / 4}
        />
      )}
    </Group>
  );
};
