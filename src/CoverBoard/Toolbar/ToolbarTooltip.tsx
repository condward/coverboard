import { FC } from 'react';
import { useAtomValue } from 'jotai';

import { Tooltip } from 'components';
import { tooltipAtom, useMainStore } from 'store';

export const ToolbarTooltip: FC = () => {
  const fontSize = useMainStore((state) => state.getFontSize());
  const tooltip = useAtomValue(tooltipAtom);

  if (!tooltip) return null;

  return (
    <Tooltip
      x={tooltip.x - fontSize / 2}
      y={tooltip.y - fontSize / 2}
      text={tooltip.text}
    />
  );
};
