import { atom, useAtomValue } from 'jotai';

import { LabelTypes, LinePointSchema, TextTypes } from 'types';

type SelectedText = {
  id: string;
  text: TextTypes | LabelTypes;
};

type SelectedElement = {
  id: string;
  open: boolean;
};

export const pointsAtom = atom<LinePointSchema | null>(null);

export const selectedAtom = atom<SelectedElement | null>(null);
export const useIsSelected = (id: string) => {
  const selected = useAtomValue(selectedAtom);

  return !!selected && selected.id === id;
};

export const useIsSelectedModalOpen = (id: string) => {
  const selected = useAtomValue(selectedAtom);

  return !!selected && selected.id === id && selected.open;
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
