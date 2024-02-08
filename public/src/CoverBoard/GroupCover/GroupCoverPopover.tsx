import React, { useState } from 'react';
import { TextField, Button, Grid, Slider, Typography } from '@mui/material';
import { GroupCoverValues, GroupCovers } from 'types';
import { CommonDialog, DirectionRadio } from 'components';
import { useMainStore, useUtilsStore } from 'store';

interface PopupProps {
  open: boolean;
  values: GroupCoverValues;
  id: GroupCovers['id'];
  scaleX: number;
  scaleY: number;
}

export const GroupCoverPopover: React.FC<PopupProps> = ({
  open,
  values,
  id,
  scaleX,
  scaleY,
}) => {
  const [text, setText] = useState<PopupProps['values']>(values);
  const [currentScale, setCurrentScale] = useState({ scaleX, scaleY });
  const updateGroupsText = useMainStore((state) => state.updateGroupsText);
  const updateGroupScale = useMainStore((state) => state.updateGroupScale);
  const updateGroupDir = useMainStore((state) => state.updateGroupDir);
  const updateGroupSubDir = useMainStore((state) => state.updateGroupSubDir);
  const setSelected = useUtilsStore((state) => state.setSelected);

  const handTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    label: 'title' | 'subtitle' | 'titleDir' | 'subTitleDir',
  ) => {
    setText((currentText) => ({
      ...currentText,
      [label]: event.target.value,
    }));
  };

  const handleNumberChange = (
    _: Event,
    value: number | number[],
    scaleType: 'scaleX' | 'scaleY',
  ) => {
    if (Array.isArray(value)) return;

    setCurrentScale((prevScale) => ({
      ...prevScale,
      [scaleType]: value,
    }));
  };

  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );
  const handleDelete = () => {
    removeCoverAndRelatedLines(id);
    setSelected(null);
  };

  const handleSubmit = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    updateGroupsText(id, text.title, text.subtitle);
    updateGroupDir(id, text.titleDir);
    updateGroupSubDir(id, text.subTitleDir);
    updateGroupScale(id, currentScale);
    setSelected(null);
  };

  return (
    <CommonDialog
      open={open}
      onClose={() => setSelected({ id, open: false })}
      title="Edit group">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              label="group title"
              fullWidth
              value={text.title}
              onChange={(evt) => handTextChange(evt, 'title')}
            />
            <DirectionRadio
              name="titleRadio"
              value={text.titleDir}
              onChange={(evt) => handTextChange(evt, 'titleDir')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="group description"
              fullWidth
              value={text.subtitle}
              onChange={(evt) => handTextChange(evt, 'subtitle')}
            />
            <DirectionRadio
              name="subtitleRadio"
              value={text.subTitleDir}
              onChange={(evt) => handTextChange(evt, 'subTitleDir')}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>ScaleX:</Typography>
            <Slider
              min={0}
              max={10}
              step={0.5}
              valueLabelDisplay="on"
              defaultValue={currentScale.scaleX}
              value={currentScale.scaleX}
              onChange={(evt, value) =>
                handleNumberChange(evt, value, 'scaleX')
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>ScaleY:</Typography>
            <Slider
              min={0}
              max={10}
              step={0.5}
              valueLabelDisplay="on"
              defaultValue={currentScale.scaleY}
              value={currentScale.scaleY}
              onChange={(evt, value) =>
                handleNumberChange(evt, value, 'scaleY')
              }
            />
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
