import { Tooltip } from 'components';
import { useMainStore, useToolbarStore } from 'store';

export const ToolbarTooltip: React.FC = () => {
  const fontSize = useMainStore((state) => state.fontSize());
  const tooltip = useToolbarStore((state) => state.tooltip);

  if (!tooltip) return null;

  return (
    <Tooltip
      x={tooltip.x - fontSize / 2}
      y={tooltip.y - fontSize / 2}
      text={tooltip.text}
    />
  );
};
