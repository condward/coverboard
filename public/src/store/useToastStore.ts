import { create } from 'zustand';

interface UseToastParams {
  toastMessage: {
    text: string;
    type: 'success' | 'error' | 'warning';
  } | null;
  handleToastMessageClose: () => void;
  showSuccessMessage: (text: string) => void;
  showErrorMessage: (text: string) => void;
  showWarningMessage: (text: string) => void;
}

export const useToastStore = create<UseToastParams>()((set) => {
  return {
    toastMessage: null,
    handleToastMessageClose: () => set({ toastMessage: null }),
    showSuccessMessage: (text: string) =>
      set({ toastMessage: { text, type: 'success' } }),
    showErrorMessage: (text: string) =>
      set({ toastMessage: { text, type: 'error' } }),
    showWarningMessage: (text: string) =>
      set({ toastMessage: { text, type: 'warning' } }),
  };
});
