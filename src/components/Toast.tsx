import { Snackbar, Alert } from '@mui/material';
import { useToastStore } from 'store';

export const Toast: React.FC = () => {
  const toastMessage = useToastStore((state) => state.toastMessage);
  const handleToastMessageClose = useToastStore(
    (state) => state.handleToastMessageClose,
  );

  if (!toastMessage) return null;

  return (
    <Snackbar
      open={!!toastMessage}
      autoHideDuration={3000}
      onClose={handleToastMessageClose}>
      <Alert severity={toastMessage.type} onClose={handleToastMessageClose}>
        {toastMessage.text}
      </Alert>
    </Snackbar>
  );
};
