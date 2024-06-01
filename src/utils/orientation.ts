import { useOrientation } from 'react-use';

export const useIsLandscape = () => {
  const { type } = useOrientation();

  return type === 'landscape-primary';
};
