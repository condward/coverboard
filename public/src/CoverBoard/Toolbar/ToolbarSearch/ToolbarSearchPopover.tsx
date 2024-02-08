import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
} from '@mui/material';

import {
  ToolConfigIDs,
  CoverLabelValues,
  Media,
  MediaValues,
  MediaMap,
} from 'types';
import { CommonDialog } from 'components';
import { flushSync } from 'react-dom';
import { useMainStore } from 'store';
import { shallow } from 'zustand/shallow';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (inputArray: Array<CoverLabelValues>) => void;
}

const initialState = () => [
  { title: '', subtitle: '' },
  { title: '', subtitle: '' },
  { title: '', subtitle: '' },
  { title: '', subtitle: '' },
  { title: '', subtitle: '' },
];

export const ToolbarSearchPopover: React.FC<PopupProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [inputs, setInputs] = useState<Array<CoverLabelValues>>(initialState());
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useMainStore(
    (state) => [state.configs.media, state.setMedia],
    shallow,
  );
  const coversLength = useMainStore((state) => state.covers.length);
  const titleLabel = useMainStore((state) => state.titleLabel());
  const subTitleLabel = useMainStore((state) => state.subTitleLabel());

  const handleInputChange = (
    index: number,
    field: 'title' | 'subtitle',
    value: string,
  ) => {
    setInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      updatedInputs[index][field] = value;
      return updatedInputs;
    });
  };

  const handleSubmit = async (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();

    flushSync(() => {
      setLoading(true);
    });

    try {
      const filterInputs = inputs.filter(
        (input) => input.title !== '' || input.subtitle !== '',
      );
      await onSubmit(filterInputs);
      setInputs(initialState());
      onClose();
    } catch (err) {
      if (err === 'NOT_FOUND') {
        return;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleMediaChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setMedia(evt.target.value as Media);
    setInputs(initialState());
  };

  let isInputDisabled =
    !!inputs.find(
      (input) =>
        (input.title !== '' &&
          input.subtitle === '' &&
          subTitleLabel.required) ||
        (input.title === '' && titleLabel.required && input.subtitle !== ''),
    ) || inputs.every((input) => input.title === '' && input.subtitle === '');

  if (subTitleLabel.label === MediaValues.YEAR) {
    const hasIncompleteYear = !!inputs.find(
      (input) => input.subtitle.length > 0 && input.subtitle.length !== 4,
    );

    if (hasIncompleteYear) {
      isInputDisabled = true;
    }
  }

  return (
    <CommonDialog
      open={open}
      title="Search and add"
      onClose={onClose}
      hash={ToolConfigIDs.SEARCH}>
      <form onSubmit={handleSubmit}>
        <Grid item sm={6} xs={12}>
          {!coversLength ? (
            <>
              <label>Pick the media:</label>
              <RadioGroup
                row
                aria-label="media"
                name="media"
                value={media}
                style={{ marginBottom: '20px' }}
                onChange={handleMediaChange}>
                <FormControlLabel
                  disabled={!!coversLength}
                  value={Media.MUSIC}
                  control={<Radio />}
                  label={Media.MUSIC}
                />
                <FormControlLabel
                  disabled={!!coversLength}
                  value={Media.MOVIE}
                  control={<Radio />}
                  label={Media.MOVIE}
                />
                <FormControlLabel
                  disabled={!!coversLength}
                  value={Media.TVSHOW}
                  control={<Radio />}
                  label={Media.TVSHOW}
                />
                <FormControlLabel
                  disabled={!!coversLength}
                  value={Media.BOOK}
                  control={<Radio />}
                  label={Media.BOOK}
                />
                <FormControlLabel
                  disabled={!!coversLength}
                  value={Media.GAME}
                  control={<Radio />}
                  label={Media.GAME}
                />
              </RadioGroup>
            </>
          ) : (
            <Tooltip
              title={
                <>
                  <p>Clear board</p>
                  <p>Add new page in Share button</p>
                  <p>Change Url after /coverboard</p>
                </>
              }>
              <Button
                style={{ marginBottom: '10px', textTransform: 'capitalize' }}>
                {MediaMap[media].emoji} {media} (change ℹ️ )
              </Button>
            </Tooltip>
          )}
        </Grid>
        {inputs.map((input, index) => (
          <Grid
            container
            rowGap={0.5}
            key={`input-${index}`}
            style={{
              marginBottom: '20px',
              backgroundColor: '#F2F4F7',
            }}>
            <Grid item sm={6} xs={12}>
              <TextField
                autoFocus={index === 0}
                fullWidth
                label={`${titleLabel.label}${titleLabel.required ? '*' : ''}`}
                value={input.title}
                onChange={(e) =>
                  handleInputChange(index, 'title', e.target.value)
                }
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                fullWidth
                disabled={subTitleLabel.hidden}
                label={`${subTitleLabel.label}${
                  subTitleLabel.required ? '*' : ''
                }`}
                value={input.subtitle}
                onChange={(e) =>
                  handleInputChange(index, 'subtitle', e.target.value)
                }
              />
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            disabled={isInputDisabled || loading}
            type="submit">
            Submit
          </Button>
        </Grid>
      </form>
    </CommonDialog>
  );
};
