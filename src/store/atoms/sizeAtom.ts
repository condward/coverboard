import { atom } from 'jotai';

import { MAX_BOUNDARY } from 'types';

export const sizeAtom = atom<{
  width: number;
  height: number;
}>({
  width: Math.max(500, Math.min(MAX_BOUNDARY, window.innerWidth)),
  height: Math.max(500, Math.min(MAX_BOUNDARY, window.innerHeight)),
});
