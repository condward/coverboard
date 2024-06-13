import { FC, memo } from 'react';
import { useAtom, useSetAtom } from 'jotai';

import { PosTypes } from 'types';
import { editTitleAtom, hideToolbarAtom, useMainStore } from 'store';
import { CommonTextLabel } from 'CoverBoard/Common';
import { useIsLandscape, useSaveId } from 'utils';
import { useGetSizesContext } from 'providers';

const TitleLabelWithoutMemo: FC = () => {
  const isLandscape = useIsLandscape();
  const updateConfigs = useMainStore((state) => state.updateConfigs);
  const title = useMainStore((state) => state.configs.title.text);
  const showMainTitle = useMainStore((state) => state.configs.title.show);
  const saveId = useSaveId();
  const color = useMainStore((state) => state.getColor());
  const showHelpers = useMainStore((state) => state.configs.layout.helpers);
  const { toolbarIconSize, dragLimits } = useGetSizesContext();

  const [open, setOpen] = useAtom(editTitleAtom);
  const setHideToolBar = useSetAtom(hideToolbarAtom);
  const titleMode = showMainTitle
    ? title || (showHelpers ? `<edit ${saveId} title>` : '')
    : '';

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
      x={isLandscape ? dragLimits.width / 21 : toolbarIconSize / 2}
      y={isLandscape ? toolbarIconSize / 2 : dragLimits.width / 21}
      width={dragLimits.width * 0.9}
      dir={PosTypes.TOP}
      labelSize={2}
    />
  );
};

export const TitleLabel = memo(TitleLabelWithoutMemo);
