import { useAtomValue } from 'jotai';

import {
  useIsPopOpen,
  selectedAtom,
  editingTextAtom,
  editTitleAtom,
} from 'store';

export const usePreventKeys = () => {
  const editTitle = useAtomValue(editTitleAtom);
  const openPopup = useIsPopOpen();
  const selected = useAtomValue(selectedAtom);
  const isContextModalOpen = !!selected?.open;
  const isTextSelected = !!useAtomValue(editingTextAtom);

  return openPopup || isContextModalOpen || isTextSelected || editTitle;
};
