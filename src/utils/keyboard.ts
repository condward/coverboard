import { useAtomValue } from 'jotai';

import {
  selectedAtom,
  editingTextAtom,
  editTitleAtom,
  configAtom,
  searchAtom,
  shareAtom,
} from 'store';

export const usePreventKeys = () => {
  const editTitle = useAtomValue(editTitleAtom);
  const isContextModalOpen = !!useAtomValue(selectedAtom)?.open;
  const isTextSelected = !!useAtomValue(editingTextAtom);
  const searchOpen = useAtomValue(searchAtom);
  const configOpen = useAtomValue(configAtom);
  const shareOpen = useAtomValue(shareAtom);

  return (
    searchOpen ||
    configOpen ||
    shareOpen ||
    isContextModalOpen ||
    isTextSelected ||
    editTitle
  );
};
