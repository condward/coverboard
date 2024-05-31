import { FC } from 'react';
import { useAtom } from 'jotai';

import { configAtom, searchAtom, shareAtom } from 'store';

import { ToolbarSharePopover } from './ToolbarShare';
import { ToolbarSearch } from './ToolbarSearch';
import { ToolbarConfigPopover } from './ToolbarConfig';

export const ToolbarPopovers: FC = () => {
  const [openConfig, setOpenConfig] = useAtom(configAtom);
  const [openSearch, setOpenSearch] = useAtom(searchAtom);
  const [openShare, setOpenShare] = useAtom(shareAtom);

  return (
    <>
      {openSearch && <ToolbarSearch onClose={() => setOpenSearch(false)} />}
      {openConfig && (
        <ToolbarConfigPopover onClose={() => setOpenConfig(false)} />
      )}
      {openShare && <ToolbarSharePopover onClose={() => setOpenShare(false)} />}
    </>
  );
};
