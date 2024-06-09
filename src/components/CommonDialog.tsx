/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  Box,
} from '@mui/material';
import { useSetAtom } from 'jotai';
import { ArrowCircleLeft, Close as CloseIcon } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useEffect, ReactNode, FormEvent, FC } from 'react';

import { selectedAtom } from 'store';
import { clearHash, setHash } from 'utils';
import { backColorMap, BackColors, SPACING_GAP } from 'types';

interface CommonDialogProps {
  onClose: () => void;
  onReturn?: () => void;
  onSubmit?: (e: FormEvent) => void;
  content: ReactNode;
  actions?: ReactNode;
  header?: ReactNode;
  navigation?: ReactNode;
  title: string;
  hash?: string;
  isForm?: boolean;
  opaque?: boolean;
}

export const CommonDialog: FC<CommonDialogProps> = ({
  onClose,
  onSubmit,
  onReturn,
  content,
  actions,
  navigation,
  title,
  header,
  hash,
  isForm = true,
  opaque = false,
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

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open
      onClose={handleClose}
      component={isForm ? 'form' : undefined}
      onSubmit={isForm ? onSubmit : undefined}
      PaperProps={{
        style: {
          opacity: opaque ? 1 : 0.85,
          minWidth: fullScreen ? undefined : '35rem',
        },
      }}>
      <DialogTitle color={backColorMap[BackColors.DARKER]}>
        <Stack
          gap={SPACING_GAP}
          direction="row"
          alignItems="center"
          style={{ textTransform: 'uppercase' }}>
          {onReturn && (
            <IconButton
              aria-label="close"
              title="Return"
              color="inherit"
              onClick={onReturn}>
              <ArrowCircleLeft />
            </IconButton>
          )}
          {title}
          <Stack direction="row" justifyContent="flex-end">
            <Box
              sx={{
                position: 'absolute',
                right: 60,
                top: 12,
              }}>
              {header}
            </Box>
            <IconButton
              aria-label="close"
              title="Close"
              color="inherit"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider />
        </Stack>
      </DialogTitle>
      <DialogContent style={{ paddingTop: '0.4rem' }}>
        <Stack gap={SPACING_GAP / 2}>
          {navigation}
          {content}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: '#F2F4F7' }}>
        {actions}
      </DialogActions>
    </Dialog>
  );
};
