import { FC, memo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAtom } from 'jotai';

import { PosTypes } from 'types';
import { editTitleAtom, useMainStore } from 'store';
import { CommonTextLabel } from 'CoverBoard/Common';
import { useSaveId } from 'utils';

const TitleLabelWithoutMemo: FC = () => {
  const updateTitle = useMainStore((state) => state.updateTitle);
  const resetTitle = useMainStore((state) => state.resetTitle);
  const title = useMainStore((state) => state.configs.title);
  const showMainTitle = useMainStore((state) => state.configs.showMainTitle);
  const saveId = useSaveId();
  const color = useMainStore((state) => state.getColor());

  const toobarIconSize = useMainStore((state) => state.getToobarIconSize());
  const dragLimits = useMainStore(useShallow((state) => state.getDragLimits()));

  const [open, setOpen] = useAtom(editTitleAtom);

  const handleReset = () => {
    resetTitle();
  };

  const handleSetLabel = (text: string) => {
    updateTitle(text);
  };

  const titleMode = showMainTitle ? title || `<edit ${saveId} title>` : '';

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

export const TitleLabel = memo(TitleLabelWithoutMemo);
