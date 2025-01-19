import { FC } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import { PosTypes } from 'types';
import { editTitleAtom, hideToolbarAtom, useShallowMainStore } from 'store';
import { CommonTextLabel } from 'CoverBoard/Common';
import { useSaveId } from 'utils';
import { useGetSizesContext } from 'providers';
import { TitleKeyboardListener } from 'CoverBoard/Keyboard';

const fillValue = 0.9;

export const TitleLabel: FC = () => {
  const saveId = useSaveId();

  const { canvasLimits, fontSize } = useGetSizesContext();

  const { titleText, color, updateConfigs, showTitle, showHelpers } =
    useShallowMainStore((state) => ({
      titleText: state.configs.title.text,
      showTitle: state.configs.title.show,
      showHelpers: state.configs.layout.helpers,
      updateConfigs: state.updateConfigs,
      color: state.getColor(),
    }));

  const { open, setOpen, setHideToolBar } = {
    open: useAtomValue(editTitleAtom),
    setOpen: useSetAtom(editTitleAtom),
    setHideToolBar: useSetAtom(hideToolbarAtom),
  };

  const titleMode = showTitle
    ? titleText || (showHelpers ? `<edit ${saveId} title>` : '')
    : '';

  return (
    <>
      {showTitle && <TitleKeyboardListener />}
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
    </>
  );
};
