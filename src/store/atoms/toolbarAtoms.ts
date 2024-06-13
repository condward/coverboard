import { atom, useAtomValue } from 'jotai';

import { ToolConfigIDs } from 'types';
import { getHash } from 'utils';

const hash = getHash();

export const searchAtom = atom(hash === ToolConfigIDs.SEARCH);
export const configAtom = atom(hash === ToolConfigIDs.CONFIG);
export const shareAtom = atom(hash === ToolConfigIDs.SHARE);
export const hideToolbarAtom = atom(false);
export const toolbarDragAtom = atom(false);

export const isPopupOpenAtom = atom(
  (get) => get(searchAtom) || get(configAtom) || get(shareAtom),
);
export const useIsPopOpen = () => {
  return useAtomValue(isPopupOpenAtom);
};
