import { Html } from 'react-konva-utils';

import { ToolbarConfigPopover } from '.';
import { ToolbarConfigParams, ToolbarConfigValues } from 'types';
import { useMainStore, useToolbarStore } from 'store';
import { shallow } from 'zustand/shallow';

export const ToolbarConfig: React.FC = () => {
  const [openConfig, setOpenConfig] = useToolbarStore(
    (state) => [state.openConfig, state.setOpenConfig],
    shallow,
  );
  const updateConfigs = useMainStore((state) => state.updateConfigs);

  const updateAllCoversDir = useMainStore((state) => state.updateAllCoversDir);
  const updateAllStarsDir = useMainStore((state) => state.updateAllStarsDir);
  const updateAllGroupsDir = useMainStore((state) => state.updateAllGroupsDir);

  const handleUpdateCover = (
    config: ToolbarConfigParams,
    updatedParam?: ToolbarConfigValues,
  ) => {
    if (updatedParam === ToolbarConfigValues.LABEL_DIR) {
      updateAllCoversDir(config[ToolbarConfigValues.LABEL_DIR]);
    } else if (updatedParam === ToolbarConfigValues.STARS_DIR) {
      updateAllStarsDir(config[ToolbarConfigValues.STARS_DIR]);
    } else if (updatedParam === ToolbarConfigValues.GROUP_DIR) {
      updateAllGroupsDir(config[ToolbarConfigValues.GROUP_DIR]);
    }
    updateConfigs({ ...config, title: config.title.trim() });
  };

  if (!openConfig) return null;

  return (
    <Html>
      <ToolbarConfigPopover
        open={openConfig}
        onClose={() => setOpenConfig(false)}
        onSubmit={handleUpdateCover}
      />
    </Html>
  );
};
