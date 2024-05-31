import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
} from '@mui/material';
import { useSetAtom } from 'jotai';
import { Close as CloseIcon } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useEffect, ReactNode, FormEvent, FC } from 'react';

import { selectedAtom } from 'store';
import { clearHash, setHash } from 'utils';
import { backColorMap, BackColors } from 'types';

import { SPACING_GAP } from './constants';

interface CommonDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  content: ReactNode;
  actions: ReactNode;
  title: string;
  hash?: string;
  isForm?: boolean;
}

export const CommonDialog: FC<CommonDialogProps> = ({
  open,
  onClose,
  onSubmit,
  content,
  actions,
  title,
  hash,
  isForm = true,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const setSelected = useSetAtom(selectedAtom);

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
      component={isForm ? 'form' : undefined}
      onSubmit={isForm ? onSubmit : undefined}
      PaperProps={{
        style: {
          opacity: 0.85,
          minWidth: fullScreen ? undefined : '35rem',
        },
      }}>
      <DialogTitle color={backColorMap[BackColors.DARKER]}>
        <Stack gap={SPACING_GAP}>
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
          <Divider />
        </Stack>
      </DialogTitle>
      <DialogContent style={{ paddingTop: '0.4rem' }}>{content}</DialogContent>
      <DialogActions sx={{ backgroundColor: '#F2F4F7' }}>
        {actions}
      </DialogActions>
    </Dialog>
  );
};
