import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { LineValues, Lines, PosTypes } from 'types';
import { CommonDialog } from 'components';
import { useMainStore, useUtilsStore } from 'store';

interface PopupProps {
  open: boolean;
  values: LineValues;
  id: Lines['id'];
}

export const LinePopover: React.FC<PopupProps> = ({ open, values, id }) => {
  const [text, setText] = useState<PopupProps['values']>(values);
  const updateLineDir = useMainStore((state) => state.updateLineDir);
  const updateLineText = useMainStore((state) => state.updateLineText);
  const setSelected = useUtilsStore((state) => state.setSelected);

  const handTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    label: 'text' | 'dir',
  ) => {
    setText((currentText) => ({
      ...currentText,
      [label]: event.target.value,
    }));
  };

  const handleSubmit = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    updateLineText(id, text.text);
    updateLineDir(id, text.dir);
    setSelected(null);
  };

  const removeLine = useMainStore((state) => state.removeLine);
  const handleDelete = () => {
    removeLine(id);
    setSelected(null);
  };

  return (
    <CommonDialog
      open={open}
      onClose={() => setSelected({ id, open: false })}
      title="Edit labels">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              label="line label"
              fullWidth
              value={text.text}
              onChange={(evt) => handTextChange(evt, 'text')}
            />
            <RadioGroup
              row
              aria-label="position"
              name="position"
              value={text.dir}
              onChange={(evt) => handTextChange(evt, 'dir')}>
              <FormControlLabel
                value={PosTypes.BOTTOM}
                control={<Radio />}
                label={PosTypes.BOTTOM}
              />
              <FormControlLabel
                value={PosTypes.TOP}
                control={<Radio />}
                label={PosTypes.TOP}
              />
              <FormControlLabel
                value={PosTypes.LEFT}
                control={<Radio />}
                label={PosTypes.LEFT}
              />
              <FormControlLabel
                value={PosTypes.RIGHT}
                control={<Radio />}
                label={PosTypes.RIGHT}
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginRight: '20px', marginBottom: '20px' }}>
              Submit
            </Button>
            <Button
              variant="contained"
              color="error"
              type="button"
              onClick={handleDelete}
              style={{ marginRight: '20px', marginBottom: '20px' }}>
              Delete
            </Button>
          </Grid>
        </Grid>
      </form>
    </CommonDialog>
  );
};
