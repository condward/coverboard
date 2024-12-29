import { useAtomValue } from 'jotai';

import {
  useIsPopOpen,
  selectedAtom,
  editingTextAtom,
  editTitleAtom,
} from 'store';

export const usePreventKeys = () => {
  const openPopup = useIsPopOpen();
  const { editTitle, isContextModalOpen, isTextSelected } = {
    editTitle: useAtomValue(editTitleAtom),
    isContextModalOpen: !!useAtomValue(selectedAtom)?.open,
    isTextSelected: !!useAtomValue(editingTextAtom),
  };

  return openPopup || isContextModalOpen || isTextSelected || editTitle;
};
