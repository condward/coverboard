import { FC, useState } from 'react';
import { TextField, Button, Link, Stack } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ZodError } from 'zod';
import {
  DeleteOutlined,
  LinkOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@mui/icons-material';
import { useAtomValue } from 'jotai';

import {
  CoverSchema,
  Media,
  SPACING_GAP,
  mediaMap,
  CoverSchemaOutput,
  coverSchema,
} from 'types';

import {
  CommonDialog,
  SliderInput,
  DirectionRadio,
  FieldSet,
  InputAction,
} from 'components';
import { configAtom, useMainStore, useToastStore } from 'store';
import { useGetSizesContext } from 'providers';
import { useIsLandscape } from 'utils';

import { useSearchValue } from './useSearchValue';
import { CoverConnectionPopover } from './connections';

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
  ];
};

interface CoverPopoverProps {
  onClose: (id?: string) => void;
  onChange: (from: string, to: string) => void;
  cover: CoverSchema;
  onReturn?: () => void;
}

export const CoverPopover: FC<CoverPopoverProps> = ({
  cover,
  onClose,
  onChange,
  onReturn,
}) => {
  const [conn, setOpenConn] = useState(false);
  const titleLabel = useMainStore((state) => state.getTitleLabel().label);
  const subTitleLabel = useMainStore((state) => state.getSubTitleLabel().label);
  const media = useMainStore((state) => state.configs.media);
  const removeCoverAndRelatedArrows = useMainStore(
    (state) => state.removeCoverAndRelatedArrows,
  );
  const totalElements = useMainStore(
    (state) => state.covers.length + state.groups.length,
  );
  const configToolbarOpen = useAtomValue(configAtom);
  const showSuccessMessage = useToastStore((state) => state.showSuccessMessage);
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const updateCover = useMainStore((state) => state.updateCover);

  const buttons = getButtons(media, cover);
  const searchValue = useSearchValue(cover.id);
  const isLandscape = useIsLandscape();
  const { dragLimits, coverSizeWidth, coverSizeHeight } = useGetSizesContext();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isDirty },
  } = useForm<CoverSchema, unknown, CoverSchemaOutput>({
    resolver: zodResolver(coverSchema),
    defaultValues: cover,
  });

  const onSubmit = handleSubmit(
    (values) => {
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
        pos: {
          x: values.pos.x,
          y: values.pos.y,
        },
      });
      onClose();
    },
    (error) => {
      const errorMessage = Object.values(error).map((err) => err.message)[0];

      if (errorMessage !== undefined) {
        showErrorMessage(errorMessage);
      }
    },
  );

  const handleDelete = () => {
    removeCoverAndRelatedArrows(cover.id);
    onClose();
  };

  const handleSearchAgain = async () => {
    const values = getValues();

    const subTitleRequired = mediaMap[media].subtitle.required;
    if (!values.title.text) {
      showErrorMessage(`${mediaMap[media].title.label} is required`);
      return;
    } else if (subTitleRequired && !values.subtitle.text) {
      showErrorMessage(`${mediaMap[media].subtitle.label} is required`);
      return;
    }

    try {
      await searchValue.mutateAsync([
        {
          title: values.title.text,
          subtitle: values.subtitle.text,
        },
      ]);
      onClose();
      showSuccessMessage('Cover was updated with success');
    } catch (error) {
      if (error instanceof ZodError) {
        showErrorMessage('Bad response from the server');
      }
      showErrorMessage('Failed to fetch from the server');
    }
  };

  return (
    <CommonDialog
      onClose={() => onClose(cover.id)}
      onReturn={onReturn}
      title="Edit Cover"
      opaque={configToolbarOpen}
      header={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          {buttons.map((button) => (
            <Button
              key={button.name}
              variant="outlined"
              color="info"
              target="_blank"
              component={Link}
              startIcon={<LinkOutlined />}
              href={button.href}>
              {button.name}
            </Button>
          ))}
        </Stack>
      }
      content={
        <>
          <Stack direction="row" justifyContent="end">
            <small>ID: {cover.id.slice(0, 8).toUpperCase()}</small>
          </Stack>
          <Stack direction="column" gap={SPACING_GAP}>
            <FieldSet
              label={
                cover.title.search
                  ? `${titleLabel} (searched: ${cover.title.search})`
                  : titleLabel
              }
              direction="column">
              <Controller
                name="title.text"
                control={control}
                render={({ field, fieldState }) => (
                  <InputAction
                    input={
                      <TextField
                        label={`text`}
                        autoFocus
                        fullWidth
                        value={field.value}
                        onChange={field.onChange}
                      />
                    }
                    action={
                      <Button
                        variant="outlined"
                        color="secondary"
                        type="button"
                        fullWidth
                        sx={{ height: '100%' }}
                        disabled={!fieldState.isDirty}
                        onClick={() =>
                          field.onChange(getValues('title.search'))
                        }>
                        Reset
                      </Button>
                    }
                  />
                )}
              />
              <Controller
                name="title.dir"
                control={control}
                render={({ field }) => (
                  <DirectionRadio
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </FieldSet>
            <FieldSet
              label={
                cover.subtitle.search
                  ? `${subTitleLabel} (searched: ${cover.subtitle.search})`
                  : subTitleLabel
              }
              direction="column">
              <Controller
                name="subtitle.text"
                control={control}
                render={({ field, fieldState }) => (
                  <InputAction
                    input={
                      <TextField
                        label="text"
                        autoFocus
                        fullWidth
                        value={field.value}
                        onChange={field.onChange}
                      />
                    }
                    action={
                      <Button
                        variant="outlined"
                        color="secondary"
                        type="button"
                        fullWidth
                        sx={{ height: '100%' }}
                        disabled={!fieldState.isDirty}
                        onClick={() =>
                          field.onChange(getValues('subtitle.search'))
                        }>
                        Reset
                      </Button>
                    }
                  />
                )}
              />
              <Controller
                name="subtitle.dir"
                control={control}
                render={({ field }) => (
                  <DirectionRadio
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </FieldSet>
            <FieldSet label="Rating" direction="column">
              <Controller
                name="star.count"
                control={control}
                render={({ field }) => (
                  <SliderInput
                    label="Rating"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
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
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </FieldSet>
            <FieldSet
              direction="column"
              label="Position"
              gap={SPACING_GAP / 2}
              flexWrap="nowrap">
              <Controller
                name="pos.x"
                control={control}
                render={({ field }) => (
                  <SliderInput
                    label="X"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    max={
                      isLandscape
                        ? dragLimits.width - dragLimits.x
                        : dragLimits.width - dragLimits.x - coverSizeWidth
                    }
                  />
                )}
              />
              <Controller
                name="pos.y"
                control={control}
                render={({ field }) => (
                  <SliderInput
                    label="Y"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    max={
                      isLandscape
                        ? dragLimits.height - coverSizeHeight
                        : dragLimits.height + dragLimits.y - 2 * coverSizeHeight
                    }
                  />
                )}
              />
            </FieldSet>
            {cover.link && (
              <FieldSet
                direction="column"
                label="Image Link"
                gap={SPACING_GAP}
                flexWrap="nowrap">
                <Controller
                  name="link"
                  control={control}
                  render={({ field }) => (
                    <InputAction
                      input={
                        <TextField
                          fullWidth
                          disabled
                          label="Link"
                          value={field.value}
                        />
                      }
                      action={
                        <Button
                          variant="outlined"
                          color="error"
                          type="button"
                          fullWidth
                          sx={{ height: '100%' }}
                          onClick={() => field.onChange('')}>
                          Delete
                        </Button>
                      }
                    />
                  )}
                />
              </FieldSet>
            )}
          </Stack>
        </>
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          <Button
            variant="outlined"
            color="secondary"
            type="button"
            startIcon={<LinkOutlined />}
            disabled={totalElements < 2}
            onClick={() => setOpenConn(true)}>
            Links
          </Button>
          {conn && (
            <CoverConnectionPopover
              onClose={() => setOpenConn(false)}
              onChange={onChange}
              cover={cover}
            />
          )}
          <Button
            variant="contained"
            color="error"
            type="button"
            startIcon={<DeleteOutlined />}
            onClick={handleDelete}>
            Delete
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<SearchOutlined />}
            onClick={handleSearchAgain}>
            Search
          </Button>
          <Button
            disabled={!isDirty}
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<SaveOutlined />}>
            Save
          </Button>
        </Stack>
      }
      onSubmit={onSubmit}
    />
  );
};
