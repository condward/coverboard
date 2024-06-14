import { FC, memo } from 'react';
import { useAtom, useSetAtom } from 'jotai';

import { PosTypes } from 'types';
import { editTitleAtom, hideToolbarAtom, useMainStore } from 'store';
import { CommonTextLabel } from 'CoverBoard/Common';
import { useSaveId } from 'utils';
import { useGetSizesContext } from 'providers';

const TitleLabelWithoutMemo: FC = () => {
  const updateConfigs = useMainStore((state) => state.updateConfigs);
  const title = useMainStore((state) => state.configs.title.text);
  const showMainTitle = useMainStore((state) => state.configs.title.show);
  const saveId = useSaveId();
  const color = useMainStore((state) => state.getColor());
  const showHelpers = useMainStore((state) => state.configs.layout.helpers);
  const { canvasLimits, fontSize } = useGetSizesContext();

  const [open, setOpen] = useAtom(editTitleAtom);
  const setHideToolBar = useSetAtom(hideToolbarAtom);
  const titleMode = showMainTitle
    ? title || (showHelpers ? `<edit ${saveId} title>` : '')
    : '';

  const fillValue = 0.9;
  return (
    <CommonTextLabel
      color={color}
      title="title"
      open={open}
      setOpen={(val) => {
        setHideToolBar(false);
        setOpen(val);
      }}
      onReset={() => updateConfigs({ title: { text: '' } })}
      label={titleMode}
      setLabel={(text) => updateConfigs({ title: { text } })}
      x={(canvasLimits.width * (1 - fillValue)) / 2}
      y={2 * fontSize}
      width={canvasLimits.width * fillValue}
      dir={PosTypes.TOP}
      labelSize={2}
    />
  );
};

export const TitleLabel = memo(TitleLabelWithoutMemo);
