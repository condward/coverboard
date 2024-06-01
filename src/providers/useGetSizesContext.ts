import { useContext } from 'react';

import { SizesContext } from './SizesProvider';

export const useGetSizesContext = () => {
  const context = useContext(SizesContext);

  if (context === null) throw new Error();

  return context;
};
