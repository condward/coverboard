import { FC, useEffect, useState, ChangeEvent } from 'react';
import { Box, TextField } from '@mui/material';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  onReset: () => void;
  defaultText: string;
  title?: string;
  hasReset?: boolean;
  x: number;
  y: number;
  width: number;
  align: 'center' | 'left' | 'right';
  fontSize: number;
  fill: string;
  fillBack: string;
}

export const CommonTextLabelPopover: FC<PopupProps> = ({
  onClose,
  onSubmit,
  defaultText,
  fontSize,
  fill,
  fillBack,
  x,
  y,
  align,
  width,
}) => {
  const [text, setText] = useState(defaultText);

  const handTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const submitText = () => {
    onSubmit(text.trim());
    setText('');
    onClose();
  };

  useEffect(() => {
    const keyFn = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onSubmit(text.trim());
        setText('');
        onClose();
        e.preventDefault();
      } else if (e.key === 'Escape') {
        onClose();
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', keyFn);

    return () => document.removeEventListener('keydown', keyFn);
  }, [onClose, onSubmit, text]);

  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
      }}>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          submitText();
        }}>
        <TextField
          autoFocus
          value={text}
          onChange={handTextChange}
          onBlur={submitText}
          fullWidth
          sx={{
            backgroundColor: fillBack,
          }}
          inputProps={{
            style: {
              textAlign: align,
              color: fill,
              fontSize: `${fontSize}px`,
              height: `${fontSize}px`,
              padding: `${fontSize / 8}px`,
            },
          }}
        />
      </form>
    </Box>
  );
};
