import React, { useMemo } from 'react';

import { PosTypes, buildTitle } from 'types';
import { useMainStore, useUtilsStore } from 'store';
import { shallow } from 'zustand/shallow';
import { CommonTextLabel } from 'CoverBoard/Common';

export const TitleLabel: React.FC = () => {
  const updateTitle = useMainStore((state) => state.updateTitle);
  const resetTitle = useMainStore((state) => state.resetTitle);
  const title = useMainStore((state) => state.configs.title);
  const showMainTitle = useMainStore((state) => state.configs.showMainTitle);
  const saveId = useMainStore((state) => state.saveId);
  const color = useMainStore((state) => state.getColor());

  const toobarIconSize = useMainStore((state) => state.toobarIconSize());
  const dragLimits = useMainStore((state) => state.dragLimits(), shallow);

  const [open, setOpen] = useUtilsStore((state) => [
    state.editTitle,
    state.setEditTitle,
  ]);

  const handleReset = () => {
    resetTitle();
  };

  const handleSetLabel = (text: string) => {
    updateTitle(text);
  };

  const titleMode = useMemo(() => {
    if (!showMainTitle) {
      return '';
    } else if (!title) {
      return buildTitle(saveId);
    }
    return title;
  }, [saveId, showMainTitle, title]);

  return (
    <CommonTextLabel
      color={color}
      title="title"
      open={open}
      setOpen={setOpen}
      onReset={handleReset}
      label={titleMode}
      setLabel={handleSetLabel}
      x={dragLimits.width / 21}
      y={dragLimits.y + toobarIconSize / 2}
      width={dragLimits.width * 0.9}
      dir={PosTypes.TOP}
      labelSize={2}
    />
  );
};
