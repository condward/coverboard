import { Point, SelectedElement, SelectedText } from 'types';
import { createWithEqualityFn } from 'zustand/traditional';

interface UseUtilParams {
  editingText: SelectedText;
  editTitle: boolean;
  selected: SelectedElement;
  points: Point | null;
  setSelected: (value: SelectedElement) => void;
  setPoints: (value: Point | null) => void;
  setEditTitle: (value: boolean) => void;
  setEditingText: (value: SelectedText) => void;
  hasMode: () => boolean;
  isSelected: (value: { id: string }) => boolean;
  isSelectedModalOpen: (value: { id: string }) => boolean;
  isContextModalOpen: () => boolean;
  isCurrentTextSelected: (value: { id: string; text: string }) => boolean;
  isTextSelected: () => boolean;
  isSelectedElem: () => boolean;
}

export const useUtilsStore = createWithEqualityFn<UseUtilParams>()(
  (set, get) => {
    return {
      editingText: null,
      editTitle: false,
      selected: null,
      points: null,
      isTextSelected: () => !!get().editingText,
      isCurrentTextSelected: ({ id, text }) => {
        return (
          !!get().editingText &&
          get().editingText?.id === id &&
          get().editingText?.text === text
        );
      },
      isSelectedElem: () => !!get().selected,
      isSelected: ({ id }) => !!get().selected && get().selected?.id === id,
      isSelectedModalOpen: (sel) =>
        get().isSelected(sel) && !!get().selected?.open,
      isContextModalOpen: () => !!get().selected?.open,
      setSelected: (value) => set({ selected: value }),
      setPoints: (value) => set({ points: value }),
      setEditingText: (value) => {
        set({ points: null });
        set({ selected: null });
        set({ editingText: value });
      },
      setEditTitle: (value) => {
        set({ points: null });
        set({ selected: null });
        set({ editTitle: value });
      },
      hasMode: () =>
        get().editTitle ||
        !!get().editingText ||
        !!get().selected ||
        !!get().points,
    };
  },
  Object.is,
);
