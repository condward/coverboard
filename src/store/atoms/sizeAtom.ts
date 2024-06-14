import { atom } from 'jotai';

export const sizeAtom = atom<{
  width: number;
  height: number;
}>({
  width: 0,
  height: 0,
});
