import { FC, useEffect } from 'react';

interface CommonTextEditKeyboardListenerProps {
  onClose: () => void;
  onEnter: () => void;
}

export const CommonTextEditKeyboardListener: FC<
  CommonTextEditKeyboardListenerProps
> = ({ onClose, onEnter }) => {
  useEffect(() => {
    const keyFn = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onEnter();
        e.preventDefault();
      } else if (e.key === 'Escape') {
        onClose();
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [onClose, onEnter]);

  return null;
};
