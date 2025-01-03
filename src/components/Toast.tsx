import { Snackbar, Alert } from '@mui/material';
import { useAtom } from 'jotai';
import { FC } from 'react';

import { toastAtom } from 'store/atoms/toastAtoms';

export const Toast: FC = () => {
  const [toastMessage, setToastMessage] = useAtom(toastAtom);

  if (!toastMessage) return null;

  return (
    <Snackbar
      open={Boolean(toastMessage)}
      autoHideDuration={3000}
      onClose={() => setToastMessage(null)}>
      <Alert severity={toastMessage.type} onClose={() => setToastMessage(null)}>
        {toastMessage.text}
      </Alert>
    </Snackbar>
  );
};
