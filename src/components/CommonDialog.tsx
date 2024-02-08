import { Dialog, DialogTitle, IconButton, DialogContent } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { clearHash, setHash } from 'utils';
import { useUtilsStore } from 'store';

interface CommonDialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  hash?: string;
}

export const CommonDialog: React.FC<CommonDialogProps> = ({
  open,
  onClose,
  children,
  title,
  hash,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm')); // Detect small sc
  const setSelected = useUtilsStore((state) => state.setSelected);

  useEffect(() => {
    if (!hash) return;

    setHash(hash);
    setSelected(null);

    return clearHash;
  }, [hash, setSelected]);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          opacity: 0.8,
        },
      }}>
      <DialogTitle>
        {title}
        <IconButton
          aria-label="close"
          color="inherit"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        style={{
          paddingLeft: '30px',
          paddingRight: '30px',
          paddingTop: '5px',
        }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};
