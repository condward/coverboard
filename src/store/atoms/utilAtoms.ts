import { atom, useAtomValue } from 'jotai';

import { LabelTypes, ArrowPointSchema, TextTypes } from 'types';

interface SelectedText {
  id: string;
  text: TextTypes | LabelTypes;
}

interface SelectedElement {
  id: string;
  open: boolean;
}

export const pointsAtom = atom<ArrowPointSchema | null>(null);

export const parentSelectedAtom = atom<Array<string>>([]);

export const selectedAtom = atom<SelectedElement | null>(null);
export const useGetSelectedId = (id: string) => {
  const selected = useAtomValue(selectedAtom);

  return selected && selected.id === id ? id : null;
};

const editingTextAtomBase = atom<SelectedText | null>(null);
export const editingTextAtom = atom(
  (get) => get(editingTextAtomBase),
  (_, set, value: SelectedText | null) => {
    set(pointsAtom, null);
    set(selectedAtom, null);
    set(editingTextAtomBase, value);
  },
);
export const useIsCurrentTextSelected = ({ id, text }: SelectedText) => {
  const editingText = useAtomValue(editingTextAtom);

  return !!editingText && editingText.id === id && editingText.text === text;
};

const editTitleBaseAtom = atom(false);
export const editTitleAtom = atom(
  (get) => get(editTitleBaseAtom),
  (_, set, value: boolean) => {
    set(pointsAtom, null);
    set(selectedAtom, null);
    set(editTitleBaseAtom, value);
  },
);
