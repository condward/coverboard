import { atom, useAtom } from 'jotai';

import { LabelTypes, ArrowPointSchema, TextTypes } from 'types';

interface SelectedText {
  id: string;
  text: TextTypes | LabelTypes;
}

interface SelectedElement {
  id: string;
  open: boolean;
}

interface UseSelected {
  id: string;
  onSuccess?: () => void;
}

export const pointsAtom = atom<ArrowPointSchema | null>(null);

export const parentSelectedAtom = atom<Array<string>>([]);

export const selectedAtom = atom<SelectedElement | null>(null);

const editingTextAtomBase = atom<SelectedText | null>(null);
export const editingTextAtom = atom(
  (get) => get(editingTextAtomBase),
  (_, set, value: SelectedText | null) => {
    set(pointsAtom, null);
    set(selectedAtom, null);
    set(editingTextAtomBase, value);
  },
);

const editTitleBaseAtom = atom(false);
export const editTitleAtom = atom(
  (get) => get(editTitleBaseAtom),
  (_, set, value: boolean) => {
    set(pointsAtom, null);
    set(selectedAtom, null);
    set(editTitleBaseAtom, value);
  },
);

export const usePoints = (id: string) => {
  const [points, setPoints] = useAtom(pointsAtom);

  return {
    points,
    setPoints,
    pointDirection: points?.id === id ? points.dir : null,
  };
};

export const useSelected = ({ id, onSuccess }: UseSelected) => {
  const [selected, setSelected] = useAtom(selectedAtom);
  const selectedId = selected && selected.id === id ? id : null;

  const handleSelect = () => {
    setSelected({ id, open: !!selectedId });
    onSuccess?.();
  };

  return {
    selectedId,
    handleSelect,
  };
};

export const useTextSelected = ({ id, text }: SelectedText) => {
  const [editingText, setEditingText] = useAtom(editingTextAtom);

  return {
    setEditingText,
    isCurrentTextSelected:
      !!editingText && editingText.id === id && editingText.text === text,
  };
};
