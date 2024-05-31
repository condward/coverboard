import { FC } from 'react';
import { TextField, Button, Link, Stack } from '@mui/material';
import { useSetAtom } from 'jotai';
import { zodResolver } from '@hookform/resolvers/zod';

import { Controller, useForm } from 'react-hook-form';

import { CoverSchemaOutput, CoverSchema, Media, coverSchema } from 'types';
import {
  CommonDialog,
  DirectionRadio,
  SPACING_GAP,
  SliderField,
} from 'components';
import { selectedAtom, useMainStore } from 'store';

const getButtons = (media: Media, currentCover: CoverSchema) => {
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

    if (isbm && isbm.length > 0) {
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

export const CoverPopover: FC<{
  cover: CoverSchema;
}> = ({ cover }) => {
  const titleLabel = useMainStore((state) => state.getTitleLabel().label);
  const subTitleLabel = useMainStore((state) => state.getSubTitleLabel().label);
  const media = useMainStore((state) => state.configs.media);
  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const resetCoverLabels = useMainStore((state) => state.resetCoverLabels);
  const updateCover = useMainStore((state) => state.updateCover);
  const setSelected = useSetAtom(selectedAtom);

  const buttons = getButtons(media, cover);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<CoverSchema, unknown, CoverSchemaOutput>({
    resolver: zodResolver(coverSchema),
    defaultValues: cover,
  });

  const onSubmit = handleSubmit((values) => {
    updateCover(cover.id, {
      title: {
        text: values.title.text.trim(),
        dir: values.title.dir,
      },
      subtitle: {
        text: values.subtitle.text.trim(),
        dir: values.subtitle.dir,
      },
      star: {
        count: values.star.count,
        dir: values.star.dir,
      },
      link: values.link,
    });
    setSelected(null);
  });

  const handleReset = () => {
    resetCoverLabels(cover.id);
    reset();
    setSelected(null);
  };

  const handleDelete = () => {
    removeCoverAndRelatedLines(cover.id);
    setSelected(null);
  };

  return (
    <CommonDialog
      open
      onClose={() => setSelected({ id: cover.id, open: false })}
      title="Edit labels"
      content={
        <Stack direction="column" gap={SPACING_GAP}>
          <Controller
            name="title.text"
            control={control}
            render={({ field }) => (
              <TextField
                label={titleLabel}
                autoFocus
                fullWidth
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="title.dir"
            control={control}
            render={({ field }) => (
              <DirectionRadio
                label="Position"
                id="cover-title"
                name="titleRadio"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="subtitle.text"
            control={control}
            render={({ field }) => (
              <TextField
                label={subTitleLabel}
                autoFocus
                fullWidth
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="subtitle.dir"
            control={control}
            render={({ field }) => (
              <DirectionRadio
                label="Position"
                id="cover-subtitle"
                name="subtitleRadio"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="star.count"
            control={control}
            render={({ field }) => (
              <SliderField
                label="Rating"
                id="star-rating"
                name="starSlider"
                value={field.value}
                onChange={field.onChange}
                min={0}
                max={5}
                step={0.5}
              />
            )}
          />
          <Controller
            name="star.dir"
            control={control}
            render={({ field }) => (
              <DirectionRadio
                label="Position"
                id="star-rating"
                name="starRadio"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="link"
            control={control}
            render={({ field }) => (
              <TextField
                label="Image link"
                autoFocus
                fullWidth
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
            {buttons.map((button) => (
              <Button
                key={button.name}
                variant="outlined"
                color="secondary"
                target="_blank"
                component={Link}
                href={button.href}>
                {button.name}
              </Button>
            ))}
          </Stack>
        </Stack>
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          <Button
            variant="outlined"
            color="error"
            type="button"
            onClick={handleDelete}>
            Delete
          </Button>
          <Button
            disabled={!isDirty}
            variant="outlined"
            color="secondary"
            type="button"
            onClick={handleReset}>
            Reset
          </Button>

          <Button
            disabled={!isDirty}
            variant="contained"
            color="primary"
            type="submit">
            Submit
          </Button>
        </Stack>
      }
      onSubmit={onSubmit}
    />
  );
};
