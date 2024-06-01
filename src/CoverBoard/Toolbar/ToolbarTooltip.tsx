import { FC } from 'react';
import { useAtomValue } from 'jotai';

import { Tooltip } from 'components';
import { tooltipAtom } from 'store';
import { useGetSizesContext } from 'providers';

export const ToolbarTooltip: FC = () => {
  const { fontSize } = useGetSizesContext();
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
