import { atom, useSetAtom } from 'jotai';
import { useMemo } from 'react';

export const toastAtom = atom<{
  text: string;
  type: 'success' | 'error' | 'warning';
} | null>(null);

export const useShowToast = () => {
  const setToast = useSetAtom(toastAtom);

  return useMemo(
    () => ({
      showSuccessMessage: (text: string) => {
        setToast({ text, type: 'success' });
      },
      showErrorMessage: (text: string) => {
        setToast({ text, type: 'error' });
      },
    }),
    [setToast],
  );
};
