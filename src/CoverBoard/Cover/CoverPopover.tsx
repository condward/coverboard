import React, { useState } from 'react';
import {
  TextField,
  Button,
  Link,
  Grid,
  Slider,
  Typography,
} from '@mui/material';
import { CoverValues, Covers, LabelTypes, Media, PosTypes } from 'types';
import { CommonDialog, DirectionRadio } from 'components';
import { useMainStore, useUtilsStore } from 'store';

const getButtons = (media: Media, currentCover: Covers) => {
  if (media === Media.MUSIC) {
    return [
      {
        name: 'LastFM',
        href: `http://www.last.fm/music/${currentCover.title.search}/${currentCover.subtitle.search}`,
      },
      {
        name: 'Spotify',
        href: `https://open.spotify.com/search/artist%3A${currentCover.title.search}%20AND%20album%3A${currentCover.subtitle.search}/`,
      },
    ];
  } else if (media === Media.MOVIE || media === Media.TVSHOW) {
    return [
      {
        name: 'TMDB',
        href: `https://www.themoviedb.org/search?query=${
          currentCover.title.search
        }${
          currentCover.subtitle.search
            ? '&year=' + currentCover.subtitle.search
            : ''
        }`,
      },
      {
        name: 'IMDB',
        href: `https://www.imdb.com/search/title/?title=${
          currentCover.title.search
        }${
          currentCover.subtitle.search
            ? `&release_date=${currentCover.subtitle.search}-01-01,${currentCover.subtitle.search}-12-31`
            : ''
        }`,
      },
    ];
  } else if (media === Media.BOOK) {
    const isbm = currentCover.link.match(/isbn\/(\d+)-/i);

    if (isbm?.length) {
      return [
        {
          name: 'Open library',
          href: `https://openlibrary.org/isbn/${isbm[1]}`,
        },
        {
          name: 'Google Books',
          href: `https://www.google.com/search?tbo=p&tbm=bks&q=intitle:${
            currentCover.title.search
          }${
            currentCover.subtitle.search
              ? '+inauthor:' + currentCover.subtitle.search
              : ''
          }`,
        },
      ];
    }
  }
  return [
    {
      name: 'RAWG',
      href: `https://rawg.io/search?query=${currentCover.title.search}`,
    },
    {
      name: 'Steam',
      href: `https://store.steampowered.com/search/?term=${currentCover.title.search}`,
    },
    {
      name: 'Nintendo',
      href: `https://www.nintendo.com/us/search/#q=${currentCover.title.search}`,
    },
  ];
};

interface PopupProps {
  open: boolean;
  values: CoverValues;
  title?: string;
  id: Covers['id'];
  starCount: number;
  starDir: PosTypes;
}

export const CoverPopover: React.FC<PopupProps> = ({
  open,
  values,
  id,
  starCount,
  starDir,
}) => {
  const [text, setText] = useState<PopupProps['values']>(values);
  const [rating, setRating] = useState(starCount);
  const [currentStarDir, setStarDir] = useState(starDir);
  const titleLabel = useMainStore((state) => state.titleLabel().label);
  const subTitleLabel = useMainStore((state) => state.subTitleLabel().label);
  const media = useMainStore((state) => state.configs.media);
  const currentCover = useMainStore((state) =>
    state.covers.find((cov) => cov.id === id),
  );
  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const resetCoverLabel = useMainStore((state) => state.resetCoverLabel);
  const updateCoversText = useMainStore((state) => state.updateCoversText);
  const updateStarCount = useMainStore((state) => state.updateStarCount);
  const updateCoverStarDir = useMainStore((state) => state.updateCoverStarDir);
  const updateCoverTitleDir = useMainStore(
    (state) => state.updateCoverTitleDir,
  );
  const updateCoverSubtitleDir = useMainStore(
    (state) => state.updateCoverSubtitleDir,
  );
  const setSelected = useUtilsStore((state) => state.setSelected);

  const buttons = currentCover ? getButtons(media, currentCover) : [];

  const handTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    label: 'title' | 'subtitle' | 'titleDir' | 'subTitleDir',
  ) => {
    setText((currentText) => ({
      ...currentText,
      [label]: event.target.value,
    }));
  };

  const handleStarChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setStarDir(event.target.value as PosTypes);
  };

  const handleNumberChange = (_: Event, value: number | number[]) => {
    if (Array.isArray(value)) return;
    setRating(value);
  };

  const handleSubmit = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();

    updateCoversText(id, text.title.trim(), text.subtitle.trim());
    updateCoverTitleDir(id, text.subTitleDir);
    updateCoverSubtitleDir(id, text.subTitleDir);
    updateCoverStarDir(id, currentStarDir);
    updateStarCount(id, rating);
    setSelected(null);
  };

  const handleReset = () => {
    resetCoverLabel(id, LabelTypes.TITLE);
    resetCoverLabel(id, LabelTypes.SUBTITLE);
    setSelected(null);
  };

  const handleDelete = () => {
    removeCoverAndRelatedLines(id);
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
              label={titleLabel}
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
              label={subTitleLabel}
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
            <Typography gutterBottom>Rating:</Typography>
            <Slider
              min={0}
              max={5}
              step={0.5}
              valueLabelDisplay="on"
              defaultValue={rating}
              value={rating}
              onChange={(evt, value) => handleNumberChange(evt, value)}
            />
            <DirectionRadio
              name="starRadio"
              value={currentStarDir}
              onChange={handleStarChange}
            />
          </Grid>
          <Grid item xs={12}>
            {buttons.map((button) => (
              <Button
                key={button.name}
                variant="contained"
                color="secondary"
                target="_blank"
                component={Link}
                href={button.href}
                style={{ marginRight: '20px', marginBottom: '20px' }}>
                {button.name}
              </Button>
            ))}
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
              variant="outlined"
              color="primary"
              type="button"
              onClick={handleReset}
              style={{ marginRight: '20px', marginBottom: '20px' }}>
              Reset
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
