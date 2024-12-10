import { createContext, use } from 'react';

interface SizesProviderProps {
  starRadius: number;
  circleRadius: number;
  fontSize: number;
  coverSizeWidth: number;
  coverSizeHeight: number;
  padding: number;
  canvasLimits: {
    width: number;
    height: number;
  };
  screenLimits: {
    width: number;
    height: number;
  };
}

export const SizesContext = createContext<SizesProviderProps | null>(null);

export const useGetSizesContext = () => {
  const context = use(SizesContext);

  if (context === null) throw new Error();

  return context;
};
