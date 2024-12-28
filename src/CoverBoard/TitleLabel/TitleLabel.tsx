import { FC, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';

import { KeyboardShortcuts, PosTypes } from 'types';
import { editTitleAtom, hideToolbarAtom, useShallowMainStore } from 'store';
import { CommonTextLabel } from 'CoverBoard/Common';
import { usePreventKeys, useSaveId } from 'utils';
import { useGetSizesContext } from 'providers';

const fillValue = 0.9;

export const TitleLabel: FC = () => {
  const saveId = useSaveId();
  const preventKeys = usePreventKeys();
  const { canvasLimits, fontSize } = useGetSizesContext();

  const [open, setOpen] = useAtom(editTitleAtom);

  const setHideToolBar = useSetAtom(hideToolbarAtom);
  const setEditTitle = useSetAtom(editTitleAtom);

  const { titleMode, color, updateConfigs } = useShallowMainStore((state) => ({
    titleMode: state.configs.title.show
      ? state.configs.title.text ||
        (state.configs.layout.helpers ? `<edit ${saveId} title>` : '')
      : '',
    updateConfigs: state.updateConfigs,
    color: state.getColor(),
  }));

  useEffect(() => {
    if (preventKeys) return;

    const keyFn = (e: KeyboardEvent) => {
      if (e.key === KeyboardShortcuts.TITLE.toLowerCase()) {
        setEditTitle(true);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', keyFn);

    return () => window.removeEventListener('keydown', keyFn);
  }, [preventKeys, setEditTitle]);

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
